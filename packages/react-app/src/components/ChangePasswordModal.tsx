import { Dialog, DialogContent, DialogTitle, FormControl, InputLabel, Typography, useMediaQuery, useTheme, FormHelperText, Grid, Box } from "@mui/material";
import { useContext, useState } from "react";
import RoundedButton from "./RoundedButton";
import { changePassword } from "../apis";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import { passwordStrength } from "../utils/helpers";
import RoundedTextField from "./RoundedTextField";

const MISSING_ERROR = "Please fill in the required field";
interface ChangePasswordModalProps {
  open: boolean;
  onClose: (message?: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = (props) => {
  const theme = useTheme();
  const walletContext = useContext(WalletContext) as IWalletContext;
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [passwords, setPasswords] = useState<any>({ new: "", confirm: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<any>({});
  const [strength, setStrength] = useState<any>(null);

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const name = event.target.name;
    setPasswords({ ...passwords, [event.target.name]: value });
    // setPassword(value);
    setErrors({ ...errors, [name]: value ? "" : MISSING_ERROR });
    if (name === "new") {
      setStrength(passwordStrength(value));
    }
  };

  const handleSubmit = async () => {
    let newErrors: any = {};
    if (!passwords.new) {
      newErrors = { new: MISSING_ERROR };
    }
    if (!passwords.confirm) {
      newErrors = { ...newErrors, confirm: MISSING_ERROR };
    } else if (passwords.confirm !== passwords.new) {
      newErrors = { ...newErrors, confirm: "Passwords do not match" };
    }
    setErrors(newErrors);

    if (strength?.type === "success" && Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await changePassword({ id: walletContext.account.user?.id ?? "", password: passwords.new });
        if (result.id && result.firstTimeLogin === false) {
          props.onClose("Your password has been updated. Please login again with your new password.");
        }
      } catch (err: any) {
        setErrors({ request: err?.response?.data?.error ?? err ?? "Something went wrong" });
      }
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      <Dialog open={props.open} fullScreen={fullScreen} PaperProps={{ sx: { xs: 300, sm: 600 } }} maxWidth={false}>
        <DialogTitle sx={{ m: 0, p: 2, pl: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Change Password</DialogTitle>
        <DialogContent sx={{ minWidth: { xs: 300, sm: 600 }, pt: "10px !important", minHeight: 200 }}>
          <Box component="div">
            <Typography variant="body2" mt={1}>
              Please set up a new password for your account.
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              size="small"
              error={Boolean(errors?.new || strength?.type === "error")}
              color={strength?.type === "success" ? "success" : errors?.new ? "error" : "primary"}
            >
              <InputLabel htmlFor="password">New Password</InputLabel>
              <RoundedTextField
                fullWidth
                disabled={isLoading}
                id="password"
                type="password"
                name="new"
                value={passwords.new}
                onChange={handleInputOnChange}
                label="New Password"
                onKeyDown={handleKeyDown}
              />
              {(errors?.new || strength?.value) && (
                <FormHelperText sx={{ color: strength?.type === "success" ? "green" : "auto" }}>{errors?.new ? errors?.new : strength?.value ?? ""}</FormHelperText>
              )}
            </FormControl>
            <FormControl variant="outlined" fullWidth sx={{ mt: 2 }} size="small" error={Boolean(errors?.confirm)}>
              <InputLabel htmlFor="password">Confirm New Password</InputLabel>
              <RoundedTextField
                fullWidth
                disabled={isLoading}
                id="confirmPassword"
                type="password"
                name="confirm"
                value={passwords.confirm}
                onChange={handleInputOnChange}
                label="Confirm New Password"
                onKeyDown={handleKeyDown}
              />
              {errors?.confirm && <FormHelperText>{errors?.confirm}</FormHelperText>}
            </FormControl>
            <Box component="div" sx={{ background: "#f2f2f2" }} mt={2} borderRadius={2}>
              <Typography variant="body2" p={2}>
                Your password should contain:
                <br /> 1. At least 1 lowercase alphabetical character [a-z]
                <br />
                2. At least 1 uppercase alphabetical character [A-Z]
                <br />
                3. At least 1 numeric character [0-9]
                <br /> 4. At least 1 special character [!@#$%^&amp;]
                <br />
                5. 8 characters or more [8-]
              </Typography>
            </Box>
          </Box>
          <Grid container justifyContent="center">
            <RoundedButton variant="contained" sx={{ width: 300, mt: 5 }} onClick={handleSubmit}>
              Save
            </RoundedButton>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangePasswordModal;
