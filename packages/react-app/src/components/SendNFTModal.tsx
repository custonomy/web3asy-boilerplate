import { Slide, Dialog, Box, Grid, Typography, Divider, IconButton, TextField, Button, CircularProgress, useTheme, useMediaQuery } from "@mui/material";

import { CHAIN_ID, NETWORK, Web3Provider } from "../utils/constants";

import { TransitionProps } from "@mui/material/transitions";
import React, { useContext, useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronRight } from "@mui/icons-material";
import WalletContext, { IWalletContext } from "../context/WalletContext";

import { ICustonomyError } from "../utils/types";
import { ethers } from "ethers";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface SendNFTModalProps {
  open: boolean;
  onClose: () => void;
  nft: any;
}

const SendNFTModal: React.FC<SendNFTModalProps> = ({ open, onClose, nft }) => {
  const walletContext = useContext(WalletContext) as IWalletContext;
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txnHash, setTxnHash] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const [destinationAddress, setDestinationAddress] = useState<string>("");
  const [credentials, setCredentials] = useState<any>({
    email: walletContext.account.user?.email ?? "",
    address: walletContext.wallet.address ?? "",
  });

  const [message, setMessage] = useState<String | any>("");

  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);

  useEffect(() => {}, [txnHash, isLoading]);

  const handleSendNFT = async () => {
    try {
      if (!walletContext?.wallet?.address) {
        alert("Please connect to your wallet first");
        return;
      }
      if (!ethers.utils.isAddress(destinationAddress)) {
        alert("Invalid address!");
        return;
      }
      setIsLoading(true);
      setMessage("Awaiting confirmation");
      handleNextStep();

      const nonce = await Web3Provider.selectedProvider.send("eth_getTransactionCount", [walletContext.wallet.address, "latest"]);
      const iface = new ethers.utils.Interface(["function transferFrom(address from, address to, uint256 tokenId)"]);
      const data = iface.encodeFunctionData("transferFrom", [walletContext.wallet.address, destinationAddress, parseInt(nft?.id?.tokenId, 16)]);

      const sendTxn = {
        type: 2,
        from: walletContext.wallet.address,
        to: nft.contract.address,
        nonce: nonce,
        data: data,
        chainId: CHAIN_ID,
      };

      await Web3Provider.selectedProvider.provider.connect();
      const txnResult = await Web3Provider.selectedProvider.send("eth_sendTransaction", [sendTxn]);

      setTxnHash(txnResult);
      setIsLoading(false);
    } catch (error: any) {
      setError({
        status: (error as ICustonomyError).code,
        message: (error as ICustonomyError).message,
      });
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleRetry = () => {
    setStep(0);
  };

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDestinationAddress(event.target.value);
  };

  const handleViewTxn = () => {
    window.open(`https://${NETWORK === "mumbai" ? "mumbai." : ""}polygonscan.com/tx/${txnHash}`, "_blank");
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
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
          <IconButton sx={{ position: "absolute", top: 10, left: 10 }} onClick={onClose}>
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
            {nft?.title} #{parseInt(nft?.id?.tokenId, 16)}
          </Typography>
          <img src={nft.media[0].gateway} alt="nft" width={250} style={{ borderRadius: 10 }} />
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
            <Grid item height="auto" width="100%">
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
                <Typography variant="h6" sx={{ opacity: step === 1 ? 1 : 0.4 }} fontWeight={step === 1 ? "bold" : "normal"}>
                  Confirmation
                </Typography>
              </Grid>
              <Divider sx={{ my: 2, width: "100%" }} />
              {step === 0 && (
                <Box component="div" px={4}>
                  <Typography variant="body1" fontWeight="bold" fontSize={18} my={2}>
                    Destination
                  </Typography>
                  <Box component="div" sx={{ borderRadius: 2, border: "2px solid black", p: 2 }}>
                    <Grid container alignItems="center">
                      <img src="https://sandbox-winter-checkout.onrender.com/polygonLogo.png" alt="polygon" width={20} height={20} />
                      <Typography variant="body1" fontWeight="bold" ml={1}>
                        Polygon-supported Wallet Address
                      </Typography>{" "}
                    </Grid>

                    <TextField
                      fullWidth
                      error={Boolean(errors.address)}
                      variant="outlined"
                      id="address"
                      type="text"
                      color="secondary"
                      name="address"
                      placeholder="e.g. 0xeCB5..."
                      onChange={handleInputOnChange}
                      helperText={errors.address}
                      sx={{ mt: 2 }}
                    />
                    <Typography variant="body1" pt={2} textAlign="center">
                      Please ensure you entered a valid wallet address!
                    </Typography>
                  </Box>
                </Box>
              )}
              {step === 1 && (
                <Box component="div" minHeight={isTablet ? 300 : 400} display="flex" alignItems="center" justifyContent="center">
                  {isLoading ? (
                    <Typography variant="h6" component="div" display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ mx: 15 }}>
                      {message}
                      <CircularProgress sx={{ mt: 4 }} />
                    </Typography>
                  ) : (
                    <Box component="div" px={4}>
                      <Typography variant="h6" component="div" display="flex" flexDirection="column" alignItems="center" justifyContent="center" pb={4}>
                        {txnHash ? "Your NFT has been sent! 🎉" : errors.request ?? "Something went wrong during the sending."}
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
                  onClick={handleSendNFT}
                >
                  Send NFT
                </Button>
              )}
              {step === 1 && !isLoading && (
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
                        onClick={onClose}
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

export default SendNFTModal;
