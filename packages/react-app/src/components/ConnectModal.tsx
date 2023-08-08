import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Typography,
  useMediaQuery,
  useTheme,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { useContext, useState } from "react";
import { API_BASE_URL, Web3Provider, custonomyProvider, EFormType, EStorageKey, EUserType, EWalletType } from "../utils/constants";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import { authUser, forgotPassword, login, register } from "../apis";
import { isEmailValid } from "../utils/helpers";
import { IUser, IErrorResponse } from "../utils/types";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import RoundedTextField from "./RoundedTextField";
import MetaLogo from "../assets/meta-icon.png";
import { AxiosError } from "axios";

const INIT_CREDENTIALS = { email: "", password: "" };
const MISSING_ERROR = "Please fill in the required field";
interface ConnectModalProps {
  open: boolean;
  onClose: () => void;
  mode?: EFormType;
  alertMessage?: string;
  onLoginSuccess: (user: IUser) => void;
}

const ConnectModal: React.FC<ConnectModalProps> = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const walletContext = useContext(WalletContext) as IWalletContext;
  const [credentials, setCredentials] = useState(INIT_CREDENTIALS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formType, setFormType] = useState<EFormType>(props.mode ?? EFormType.REGISTER);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string>(props.alertMessage ?? "");

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    setCredentials({ ...credentials, [name]: event.target.value });
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSocialAuth = async (type: string) => {
    // reset success/error states
    setSuccess("");
    setErrors({});

    setIsLoading(true);
    let timer: NodeJS.Timeout | null = null;
    // determine URL for OAuth popup first
    let loginURL = "";
    switch (type) {
      case EUserType.GOOGLE:
        loginURL = `${API_BASE_URL}/auth/google`;
        break;
      case EUserType.FACEBOOK:
        loginURL = `${API_BASE_URL}/auth/facebook`;
        break;
      default:
        break;
    }
    const width = 500;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const popup = window.open(loginURL, "", `width=${width}, height=${height}, popup=yes, top=${top}, left=${left}`);
    let user = null;
    const MAX_COUNT = 5;
    let count = 0;

    // start OAuth process
    if (popup) {
      try {
        // check if user has authenticated
        await new Promise<void>(
          (resolve) =>
            (timer = setInterval(async () => {
              count++;
              // if popup is closed
              if (popup.closed) {
                const token = localStorage.getItem(EStorageKey.TOKEN); // get session token from backend redirection
                if (timer) {
                  // if timeout
                  if (count === MAX_COUNT) {
                    clearInterval(timer);
                  }
                  // if token is retrieved -> get logged in user info
                  if (token) {
                    try {
                      user = await authUser();
                      // if user is logged in -> clear timer
                      if (user) {
                        clearInterval(timer);
                      }
                    } catch (err: unknown) {
                      // if errors occur -> clear timer
                      setErrors({ request: (err as AxiosError<IErrorResponse>)?.response?.data?.error ?? "Something went wrong" });
                      clearInterval(timer);
                    }
                  } else {
                    // if token is not found -> clear timer
                    clearInterval(timer);
                    setIsLoading(false);
                  }
                }
                resolve();
              }
            }, 1000))
        );
      } catch (err: unknown) {
        setErrors({ request: (err as AxiosError<IErrorResponse>)?.response?.data?.error ?? "Something went wrong" });
      }

      // if user is logged in  -> update user state in global store and update to Custonomy Provider
      if (user) {
        await updateUser(user);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const updateUser = async (user: IUser) => {
    try {
      walletContext.setAccount({ ...walletContext.account, user });

      // update token from authUser()
      localStorage.setItem(EStorageKey.TOKEN, user.session);

      // update and connect to Custonomy Provider
      custonomyProvider.session = user.session;
      Web3Provider.selectedProvider = custonomyProvider;
      await custonomyProvider.connect();

      // get address(es)
      const accounts = await Web3Provider.selectedProvider.send("eth_accounts");
      // if address is found -> update wallet in global state, close the modal, call login success handler
      if (accounts.length > 0) {
        walletContext.setWallet({ address: accounts[0], type: EWalletType.CUSTONOMY });
        props.onClose();
        if (formType === EFormType.LOGIN) {
          props.onLoginSuccess(user);
        }
      } else {
        // if address is not found -> return error
        setErrors({ request: "Something went wrong. Failed to connect with your wallet." });
      }
    } catch (error: unknown) {
      // if Custonomy Provider throws any errors -> show errors and reset global states      
      setErrors({ request: (error as AxiosError<IErrorResponse>)?.message });
      // setErrors({ request: JSON.parse((error as AxiosError<IErrorResponse>).message).message });
      walletContext.reset();
      return;
    }
  };

  const connectMetamask = async () => {
    // reset success/error states
    setSuccess("");
    setErrors({});

    // alert if MetaMask is not setup in the user browser
    if (!window.ethereum) {
      alert("Please setup MetaMask first");
      return;
    }

    // update web3 provider and wallet to metamask, close the modal, refresh the page
    Web3Provider.selectedProvider = window.ethereum;
    const accounts = await Web3Provider.selectedProvider.send("eth_requestAccounts");
    walletContext.setWallet({ address: accounts[0], type: EWalletType.METAMASK });
    props.onClose();
    window.location.reload();
  };

  // switch between login and register forms
  const switchForm = (type: EFormType, clearSuccess: boolean = true) => {
    setFormType(type);
    if (clearSuccess) setSuccess("");
    setErrors({});
    setCredentials(INIT_CREDENTIALS);
  };

  // form validation
  const isFormValid = () => {
    let newErrors: any = {};
    const isLoginForm = formType === EFormType.LOGIN;

    if (!credentials.email) {
      newErrors = { ...newErrors, email: MISSING_ERROR };
    } else if (isLoginForm && !isEmailValid(credentials.email)) {
      newErrors = { ...newErrors, email: "Invalid email format" };
    }

    if (!credentials.password && isLoginForm) {
      newErrors = { ...newErrors, password: MISSING_ERROR };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocalAuth = async () => {
    let user = null;
    setSuccess("");

    // local auth if form is valid
    if (isFormValid()) {
      setIsLoading(true);
      try {
        if (formType === EFormType.LOGIN) {
          user = await login(credentials);
        } else {
          user = await register(credentials.email);
          if (user) {
            setSuccess("Registered successfully! Please check your mailbox for the login password.");
          }
        }
      } catch (err: unknown) {
        setErrors({ request: (err as AxiosError<IErrorResponse>)?.response?.data?.error ?? "Something went wrong" });
      }

      // if user is logged in  -> update user state in global store and update to Custonomy Provider
      if (user) {
        await updateUser(user);
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, type: string) => {
    if (event.key === "Enter") {
      switch (type) {
        case "localAuth":
          handleLocalAuth();
          break;
        case "forgotPw":
          handleForgotPw();
          break;
        default:
          break;
      }
    }
  };

  const handleForgotPw = async () => {
    setSuccess("");
    if (isFormValid()) {
      setIsLoading(true);
      try {
        const result = await forgotPassword(credentials.email);
        setSuccess(result.message);
        switchForm(EFormType.LOGIN, false);
      } catch (err: unknown) {
        setErrors({ request: (err as AxiosError<IErrorResponse>)?.response?.data?.error ?? "Something went wrong" });
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={props.open} fullScreen={fullScreen} PaperProps={{ sx: { xs: 300, sm: 600 } }} maxWidth={false}>
        <DialogTitle sx={{ m: 0, p: 1, pl: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {formType === EFormType.FORGOT_PASSWORD ? (
            <Box component="div" display="flex" alignItems="center">
              <IconButton onClick={() => switchForm(EFormType.LOGIN)} disabled={isLoading}>
                <ChevronLeftIcon />
              </IconButton>
              Forgot Password
            </Box>
          ) : (
            "Login With"
          )}
          <IconButton onClick={props.onClose} disabled={isLoading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ minWidth: { xs: 300, sm: 600 }, pt: "10px !important" }}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          {errors.request && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.request}
            </Alert>
          )}
          {isLoading ? (
            <Box display="flex" alignItems="center" justifyContent="center" component="div" minHeight={300}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {formType === EFormType.FORGOT_PASSWORD ? (
                <>
                  <Typography variant="body2" mt={4}>
                    Please provide your email address to receive the reset password email.
                  </Typography>
                  <FormControl variant="outlined" fullWidth sx={{ mt: 2, mb: 4 }} size="small" error={Boolean(errors.email)}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <RoundedTextField
                      fullWidth
                      disabled={isLoading}
                      id="email"
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputOnChange}
                      label="Email"
                      onKeyDown={(e) => handleKeyDown(e, "forgotPw")}
                    />
                    {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                  </FormControl>
                  <Grid container justifyContent="center">
                    <Button variant="contained" sx={{ borderRadius: 10, my: 2, width: 300 }} fullWidth onClick={handleForgotPw}>
                      Confirm
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Typography variant="body2" mb={1}>
                    Social Media
                  </Typography>
                  <Grid container alignItems="center" justifyContent="space-around">
                    <Grid item sx={{ mb: { xs: 2, sm: 0 } }}>
                      <IconButton
                        color="primary"
                        size="large"
                        sx={{ background: (theme) => theme.palette.primary.light, mr: 2 }}
                        onClick={() => handleSocialAuth(EUserType.GOOGLE)}
                        disabled={isLoading}
                      >
                        <GoogleIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        size="large"
                        sx={{ background: (theme) => theme.palette.primary.light }}
                        onClick={() => handleSocialAuth(EUserType.FACEBOOK)}
                        disabled={isLoading}
                      >
                        <img src={MetaLogo} width={23} height={23} alt="Meta" />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 3 }}>OR</Divider>
                  <Typography variant="body2">Personal Email</Typography>
                  <FormControl variant="outlined" fullWidth sx={{ mt: 2 }} size="small" error={Boolean(errors.email)}>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <RoundedTextField
                      fullWidth
                      disabled={isLoading}
                      id="email"
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputOnChange}
                      label="Email"
                      onKeyDown={(e) => handleKeyDown(e, "localAuth")}
                    />
                    {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                  </FormControl>
                  {formType === EFormType.LOGIN && (
                    <FormControl variant="outlined" fullWidth sx={{ mt: 2 }} size="small" error={Boolean(errors.password)}>
                      <InputLabel htmlFor="password">Password</InputLabel>
                      <RoundedTextField
                        fullWidth
                        disabled={isLoading}
                        id="password"
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputOnChange}
                        label="Password"
                        onKeyDown={(e) => handleKeyDown(e, "localAuth")}
                      />
                      {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                    </FormControl>
                  )}
                  <Button variant="contained" sx={{ borderRadius: 10, mt: 2 }} fullWidth onClick={handleLocalAuth}>
                    {formType === EFormType.LOGIN ? "Login" : "Register"}
                  </Button>
                  <Grid container justifyContent={{ xs: "flex-start", sm: "space-between" }} mt={1}>
                    <Grid item xs={12} sm={5} md={8}>
                      <Typography variant="body2">
                        {formType === EFormType.LOGIN ? "Don't have an account? " : "Already have an account? "}
                        <Typography
                          variant="body2"
                          component="span"
                          sx={{ cursor: "pointer", color: (theme) => theme.palette.primary.main }}
                          onClick={() => switchForm(formType === EFormType.LOGIN ? EFormType.REGISTER : EFormType.LOGIN)}
                        >
                          {formType === EFormType.LOGIN ? "Register here!" : "Login here"}
                        </Typography>
                      </Typography>
                    </Grid>
                    {formType === EFormType.LOGIN && (
                      <Grid item>
                        <Typography
                          component="span"
                          variant="body2"
                          textAlign="right"
                          sx={{ cursor: "pointer", color: (theme) => theme.palette.primary.main, textDecoration: "underline" }}
                          onClick={() => switchForm(EFormType.FORGOT_PASSWORD)}
                        >
                          Forgot Password?
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  <Divider sx={{ mt: 5, mb: 3 }}>OR</Divider>
                  <Typography variant="body2" mb={2}>
                    External Wallet
                  </Typography>
                  <Button onClick={connectMetamask} color="primary" sx={{ px: 3, py: 1, borderRadius: 10 }} variant="contained" fullWidth disabled={isLoading}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
                      alt="metamask"
                      width={25}
                      style={{ marginRight: 10 }}
                    />
                    Connect with Metamask
                  </Button>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectModal;
