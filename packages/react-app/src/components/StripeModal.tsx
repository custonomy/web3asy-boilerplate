import {
  Slide,
  Dialog,
  Box,
  Grid,
  Typography,
  Divider,
  IconButton,
  TextField,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useContext, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronRight, Email } from "@mui/icons-material";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import { mint } from "../apis";
import CreditCardForm from "./CreditCardForm";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { NETWORK } from "../utils/constants";
import { INFT } from "../utils/types";
import { isEmailValid } from "../utils/helpers";
import { ethers } from "ethers";

import { custonomyMint } from "../apis";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface StripeModalProps {
  open: boolean;
  onClose: () => void;
  nft: INFT;
}

const StripeModal: React.FC<StripeModalProps> = (props) => {
  const walletContext = useContext(WalletContext) as IWalletContext;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [credentials, setCredentials] = useState<any>({
    email: walletContext.account.user?.email ?? "",
    address: walletContext.wallet.address ?? "",
  });

  const [message, setMessage] = useState<String | any>("");
  const [isStripeLoading, setIsStripeLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const paymentIntent = new URLSearchParams(window.location.search).get(
      "payment_intent"
    );

    const getAddress = async () => {
      const address = await new URLSearchParams(window.location.search).get(
        "recepientAddress"
      );

      if (!paymentIntent || !address) {
        return;
      } else {
        setStep(2);
        if (address.length > 0) {
          mintNft(address, paymentIntent);
        }
      }
    };

    getAddress().catch(console.error);
  }, [stripe]);

  const handleStripeSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop?asset=${props.nft.asset}&recepientAddress=${credentials.address}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: "tabs",
  };

  const handlePayWithCard = () => {
    let newErrors: any = {};
    if (!isEmailValid(credentials.email)) {
      newErrors = { email: "Invalid email" };
    }
    if (!ethers.utils.isAddress(credentials.address)) {
      newErrors = { ...newErrors, address: "Invalid address" };
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      handleNextStep();
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleRetry = () => {
    setStep(0);
  };

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    setCredentials({ ...credentials, [name]: event.target.value });
  };

  const mintNft = async (address: string, paymentIntent: string) => {
    setIsLoading(true);
    setMessage("Payment success! Minting your NFT");
    try {
      const result = await custonomyMint({
        address: address,
        asset: props.nft.asset,
        id: paymentIntent,
      });
      setTxnHash(result.hash);
    } catch (err: any) {
      setErrors({
        ...errors,
        request: err?.response?.data?.error ?? "Failed to mint the NFT 😕",
      });
    }
    window.history.replaceState({}, document.title, "/shop");
    setIsLoading(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      switch (step) {
        case 0:
          handleNextStep();
          break;
        case 1:
          handleNextStep();
          break;
        default:
          break;
      }
    }
  };

  const handleViewTxn = () => {
    window.open(
      `https://${
        NETWORK === "mumbai" ? "mumbai." : ""
      }polygonscan.com/tx/${txnHash}`,
      "_blank"
    );
  };

  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.onClose}
      PaperProps={{
        sx: isTablet
          ? {}
          : {
              height: "100%",
              maxHeight: "none",
              margin: 0,
              borderRadius: 0,
              maxWidth: 850,
            },
      }}
      sx={{
        "& .MuiDialog-container": {
          justifyContent: isTablet ? "center" : "flex-end",
        },
      }}
    >
      <Grid container height="100%" width="100%">
        <Grid
          item
          sx={{ background: "#f2f2f2" }}
          p={4}
          textAlign="center"
          width={isTablet ? "100%" : "auto"}
        >
          <IconButton
            sx={{ position: "absolute", top: 10, left: 10 }}
            onClick={props.onClose}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="div"
            sx={{
              background: "white",
              borderRadius: 2,
              px: 2,
              py: 1,
              my: 2,
              fontSize: 18,
              width: "fit-content",
              margin: "auto",
            }}
          >
            {NETWORK === "mumbai" ? "TESTNET" : "MAINNET"}
          </Box>
          <Typography variant="h6" my={2}>
            {props.nft.name}
          </Typography>
          <img
            src={props.nft.image}
            alt="nft"
            width={250}
            style={{ borderRadius: 10 }}
          />
          <Box
            component="div"
            sx={{
              background: "white",
              borderRadius: "10px !important",
              px: 2,
              py: 1,
              my: 3,
              fontSize: 18,
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="body1" textAlign="left">
                NFT Price
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                $21.00
              </Typography>
            </Grid>
            <Typography
              variant="body2"
              sx={{ color: "rgba(0,0,0,.64)" }}
              textAlign="left"
              pb={2}
            >
              $21.00 x 1
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="body1" textAlign="left">
                Total
              </Typography>
              <Typography variant="body1" fontWeight="bold" textAlign="right">
                $21.00
              </Typography>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          width={isTablet ? "100%" : "auto"}
          maxWidth={isTablet ? "none" : 450}
          sx={{
            boxShadow: isTablet
              ? "-10px -10px 10px 1px #d9d9d9"
              : "-10px 0px 10px 1px #d9d9d9",
          }}
        >
          <Grid
            container
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            height="100%"
          >
            <Grid item height={step === 1 ? "90%" : "auto"} width="100%">
              <Grid container alignItems="center" mt={2} px={3}>
                {step === 0 && (
                  <Box
                    component="div"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      background: "#f2f2f2",
                      borderRadius: 100,
                      p: 1,
                      mr: 1,
                    }}
                  >
                    <img
                      src="https://sandbox-winter-checkout.onrender.com/package.svg"
                      alt="delivery"
                      width={20}
                    />
                  </Box>
                )}
                <Typography
                  variant="h6"
                  fontWeight={step === 0 ? "bold" : "normal"}
                  sx={{ opacity: step === 0 ? 1 : 0.4 }}
                >
                  Delivery
                </Typography>
                <ChevronRight sx={{ opacity: step === 0 ? 1 : 0.4 }} />
                {step === 1 && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    component="div"
                    sx={{
                      background: "#f2f2f2",
                      borderRadius: 100,
                      p: 1,
                      mr: 1,
                    }}
                  >
                    <img
                      src="https://sandbox-winter-checkout.onrender.com/payment.svg"
                      alt="pay"
                      width={20}
                    />
                  </Box>
                )}
                <Typography
                  variant="h6"
                  sx={{ opacity: step === 1 ? 1 : 0.4 }}
                  fontWeight={step === 1 ? "bold" : "normal"}
                >
                  Payment
                </Typography>
                <ChevronRight sx={{ opacity: step === 1 ? 1 : 0.4 }} />
                {step === 2 && (
                  <Box
                    component="div"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      background: "#f2f2f2",
                      borderRadius: 100,
                      p: 1,
                      mr: 1,
                    }}
                  >
                    <TaskAltIcon />
                  </Box>
                )}
                <Typography
                  variant="h6"
                  sx={{ opacity: step === 2 ? 1 : 0.4 }}
                  fontWeight={step === 2 ? "bold" : "normal"}
                >
                  Confirmation
                </Typography>
              </Grid>
              <Divider sx={{ my: 2, width: "100%" }} />
              {step === 0 && (
                <Box component="div" px={4}>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    fontSize={18}
                    mb={2}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    id="email"
                    type="email"
                    color="secondary"
                    name="email"
                    variant="outlined"
                    placeholder="Email Address"
                    error={Boolean(errors.email)}
                    value={credentials.email}
                    onChange={handleInputOnChange}
                    helperText={errors.email}
                  />
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    fontSize={18}
                    my={2}
                  >
                    Mint Delivery
                  </Typography>
                  <Box
                    component="div"
                    sx={{ borderRadius: 2, border: "2px solid black", p: 2 }}
                  >
                    <Grid container alignItems="center">
                      <img
                        src="https://sandbox-winter-checkout.onrender.com/polygonLogo.png"
                        alt="polygon"
                        width={20}
                        height={20}
                      />
                      <Typography variant="body1" fontWeight="bold" ml={1}>
                        Polygon-supported Wallet Address
                      </Typography>{" "}
                    </Grid>
                    <Typography sx={{ color: "rgba(0,0,0,.6)" }}>
                      {" "}
                      Mint this NFT to your own wallet.
                    </Typography>
                    <TextField
                      fullWidth
                      error={Boolean(errors.address)}
                      variant="outlined"
                      id="address"
                      type="text"
                      color="secondary"
                      name="address"
                      value={credentials.address}
                      placeholder="e.g. 0xeCB5..."
                      onChange={handleInputOnChange}
                      onKeyDown={handleKeyDown}
                      helperText={errors.address}
                      sx={{ mt: 2 }}
                    />
                    <Typography variant="body1" pt={2} textAlign="center">
                      🚨 WARNING! Do NOT enter in a Coinbase address. Only enter
                      in a wallet you have the private keys to. We can't help in
                      case of a mistake.
                    </Typography>
                  </Box>
                </Box>
              )}
              {step === 1 && (
                <Box component="div" px={4} height="100%">
                  <PaymentElement
                    id="payment-element"
                    options={paymentElementOptions}
                  />
                  <Button
                    fullWidth
                    disabled={!credentials.email || !credentials.address}
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      borderRadius: 3,
                      mb: 5,
                      py: 1,
                      fontSize: 18,
                      mt: isTablet ? 5 : 2,
                    }}
                    onClick={handleStripeSubmit}
                  >
                    Pay Now
                  </Button>
                </Box>
              )}
              {step === 2 && (
                <Box
                  component="div"
                  minHeight={isTablet ? 300 : 400}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {isLoading ? (
                    <Typography
                      variant="h6"
                      component="div"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {message}
                      <CircularProgress sx={{ mt: 4 }} />
                    </Typography>
                  ) : (
                    <Box component="div" px={4}>
                      <Typography
                        variant="h6"
                        component="div"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        pb={4}
                      >
                        {txnHash
                          ? "Your NFT has been minted! 🎉"
                          : errors.request ??
                            "Something went wrong in minting."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item width="100%" px={4}>
              {step === 0 && (
                <Button
                  fullWidth
                  disabled={!credentials.email || !credentials.address}
                  variant="contained"
                  color="secondary"
                  size="large"
                  sx={{
                    borderRadius: 3,
                    mb: 5,
                    py: 1,
                    fontSize: 18,
                    mt: isTablet ? 5 : 0,
                  }}
                  onClick={handlePayWithCard}
                >
                  Pay With Card
                </Button>
              )}
              {step === 2 && !isLoading && (
                <>
                  {txnHash ? (
                    <>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        size="large"
                        sx={{
                          borderRadius: 3,
                          mb: 2,
                          py: 1,
                          fontSize: 18,
                          mt: isTablet ? 4 : 0,
                        }}
                        onClick={handleViewTxn}
                      >
                        View your transaction
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        size="large"
                        sx={{
                          borderRadius: 3,
                          mb: 5,
                          py: 1,
                          fontSize: 18,
                          mt: isTablet ? 2 : 0,
                        }}
                        onClick={props.onClose}
                      >
                        Back to Shop
                      </Button>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      variant="outlined"
                      color="secondary"
                      size="large"
                      sx={{
                        borderRadius: 3,
                        mb: 5,
                        py: 1,
                        fontSize: 18,
                        mt: isTablet ? 2 : 0,
                      }}
                      onClick={handleRetry}
                    >
                      Retry
                    </Button>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default StripeModal;
