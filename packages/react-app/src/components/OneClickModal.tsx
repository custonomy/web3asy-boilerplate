import { Slide, Dialog, Box, Grid, Typography, Divider, IconButton, TextField, Button, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useContext, useState } from "react";
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
import { Provider } from "@custonomy/oneclickcheckout";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface OneClickModalProps {
  open: boolean;
  onClose: () => void;
  onCheckout: (nft: INFT, provider: Provider) => void;
  nft: INFT;
  isLoading: boolean;
  step: number;
  txnHash: string;
}

const OneClickModal: React.FC<OneClickModalProps> = (props) => {
  const walletContext = useContext(WalletContext) as IWalletContext;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  // const [step, setStep] = useState<number>(0);
  const step = props.step;
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [txnHash, setTxnHash] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [credentials, setCredentials] = useState<any>({
    email: walletContext.account.user?.email ?? "",
    address: walletContext.wallet.address ?? "",
  });

  const handleRetry = () => {};

  const handleViewTxn = () => {
    window.open(`https://${NETWORK === "mumbai" ? "mumbai." : ""}polygonscan.com/tx/${props.txnHash}`, "_blank");
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
        <Grid item sx={{ background: "#f2f2f2" }} p={4} textAlign="center" width={isTablet ? "100%" : "auto"}>
          <IconButton sx={{ position: "absolute", top: 10, left: 10 }} onClick={props.onClose}>
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
          <img src={props.nft.image} alt="nft" width={250} style={{ borderRadius: 10 }} />
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
                0.025 ETH
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,.64)" }} textAlign="left" pb={2}>
              0.025 ETH x 1
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container alignItems="center" justifyContent="space-between">
              <Typography variant="body1" textAlign="left">
                Total
              </Typography>
              <Typography variant="body1" fontWeight="bold" textAlign="right">
                0.025 ETH
              </Typography>
            </Grid>
          </Box>
        </Grid>
        <Grid
          item
          width={isTablet ? "100%" : "auto"}
          maxWidth={isTablet ? "none" : 450}
          sx={{
            boxShadow: isTablet ? "-10px -10px 10px 1px #d9d9d9" : "-10px 0px 10px 1px #d9d9d9",
          }}
        >
          <Grid container flexDirection="column" alignItems="center" justifyContent="space-between" height="100%">
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
                    <img src="https://sandbox-winter-checkout.onrender.com/package.svg" alt="delivery" width={20} />
                  </Box>
                )}
                <Typography variant="h6" fontWeight={step === 0 ? "bold" : "normal"} sx={{ opacity: step === 0 ? 1 : 0.4 }}>
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
                    <img src="https://sandbox-winter-checkout.onrender.com/payment.svg" alt="pay" width={20} />
                  </Box>
                )}
                <Typography variant="h6" sx={{ opacity: step === 1 ? 1 : 0.4 }} fontWeight={step === 1 ? "bold" : "normal"}>
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
                <Typography variant="h6" sx={{ opacity: step === 2 ? 1 : 0.4 }} fontWeight={step === 2 ? "bold" : "normal"}>
                  Confirmation
                </Typography>
              </Grid>
              <Divider sx={{ my: 2, width: "100%" }} />
              {step === 0 && (
                <Box component="div" px={4}>
                  <Typography variant="body1" fontWeight="bold" fontSize={18} mb={2}>
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
                    disabled={Boolean(credentials.email)}
                    error={Boolean(errors.email)}
                    value={credentials.email}
                    // onChange={handleInputOnChange}
                    helperText={errors.email}
                  />
                  <Typography variant="body1" fontWeight="bold" fontSize={18} my={2}>
                    Mint Delivery
                  </Typography>
                  <Box component="div" sx={{ borderRadius: 2, border: "2px solid black", p: 2 }}>
                    <Grid container alignItems="center">
                      <img src="https://sandbox-winter-checkout.onrender.com/polygonLogo.png" alt="polygon" width={20} height={20} />
                      <Typography variant="body1" fontWeight="bold" ml={1}>
                        Polygon-supported Wallet Address
                      </Typography>{" "}
                    </Grid>
                    <Typography sx={{ color: "rgba(0,0,0,.6)" }}> Mint this NFT to your own wallet.</Typography>
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
                      disabled={Boolean(credentials.address)}
                      // onChange={handleInputOnChange}
                      // onKeyDown={handleKeyDown}
                      helperText={errors.address}
                      sx={{ mt: 2 }}
                    />
                  </Box>

                  <Box
                    component="div"
                    style={{ marginTop: "20px" }}
                    sx={{ fontStyle: "italic" }}
                    // sx={{ borderRadius: 2, border: "2px solid black", p: 2 }}
                  >
                    <Typography sx={{ color: "rgba(0,0,0,.6)" }}>
                      {" "}
                      *To mint an NFT using Web3asy One-Click-Checkout solutions, you will first need to purchase tokens to the minting address and then the NFT will be minted by the minting address,
                      and will then be delivered to your own wallet.
                    </Typography>
                  </Box>
                </Box>
              )}
              {step === 1 && (
                <Box component="div" minHeight={isTablet ? 300 : 400} display="flex" alignItems="center" justifyContent="center">
                  {/* <CreditCardForm onSubmit={handleSubmit} /> */}
                  <Typography variant="h6" component="div" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    Purchasing token via 3rd Party
                    <CircularProgress sx={{ mt: 4 }} />
                  </Typography>
                </Box>
              )}
              {step === 2 && (
                <Box component="div" minHeight={isTablet ? 300 : 400} display="flex" alignItems="center" justifyContent="center">
                  {props.isLoading ? (
                    <Typography variant="h6" component="div" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                      Minting your NFT...
                      <CircularProgress sx={{ mt: 4 }} />
                    </Typography>
                  ) : (
                    <Box component="div" px={4}>
                      <Typography variant="h6" component="div" display="flex" flexDirection="column" alignItems="center" justifyContent="center" pb={4}>
                        {props.txnHash && props.txnHash !== "error" ? "Your NFT has been minted! 🎉" : "Something went wrong."}
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Grid>
            <Grid item width="100%" px={4}>
              {step === 0 && (
                <>
                  <Button
                    fullWidth
                    disabled={!credentials.email || !credentials.address}
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      borderRadius: 3,
                      mb: 3,
                      py: 1,
                      fontSize: 18,
                      mt: isTablet ? 5 : 0,
                    }}
                    onClick={() => props.onCheckout(props.nft, Provider.TRANSAK)}
                  >
                    Checkout with Transak
                  </Button>
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
                    onClick={() => props.onCheckout(props.nft, Provider.MERCURYO)}
                  >
                    Checkout with Mercuryo
                  </Button>
                </>
              )}
              {step === 2 && !props.isLoading && (
                <>
                  {props.txnHash ? (
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

export default OneClickModal;
