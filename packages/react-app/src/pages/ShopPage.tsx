import { Alert, Button, Grid, IconButton, Snackbar } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import NFTCard from "../components/NFTCard";
import { CHAIN_ID, CUSTONOMY_PROJECT_ID, NETWORK, NFTs, SHOP_PARAM, Web3Provider } from "../utils/constants";
import { ICustonomyError, INFT } from "../utils/types";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import { ethers } from "ethers";
import { Link, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/styles";
import StripeModal from "../components/StripeModal";
import CreditCardModal from "../components/CreditCardModal";

import { OneClickCheckout, Provider } from "@custonomy/oneclickcheckout";
import { CUSTONOMY_API_KEY } from "../utils/constants";
import { CUSTONOMY_END_POINT } from "../utils/constants";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { config } from "../config/env";
import { createIntent, getOrderIntent, getStripeClient } from "../apis";
import OneClickModal from "../components/OneClickModal";

const stripePromise = config.STRIPE_PKEY ? loadStripe(config.STRIPE_PKEY) : null;

const StyledAlert = styled(Alert)({
  "& .MuiAlert-action": {
    padding: 0,
  },
});

const ShopPage = () => {
  const walletContext = useContext(WalletContext) as IWalletContext;
  const { param } = useParams();
  const [txnHash, setTxnHash] = useState<string>("");
  const [selectedNFT, setSelectedNFT] = useState<INFT | null>(null);
  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [purchased, setPurchased] = useState<Boolean>(false);

  const [message, setMessage] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [oneClickStatus, setOneClickStatus] = useState<{ isLoading: boolean; txnHash: string }>({ isLoading: false, txnHash: "" });

  const [mintingMode, setMintingMode] = useState<{ mode: "oneclick" | "creditcard" | ""; step: number }>({ mode: "", step: 0 });

  useEffect(() => {
    const purchasedNFT = new URLSearchParams(window.location.search).get("asset");

    const paymentIntentSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (paymentIntentSecret) setClientSecret(paymentIntentSecret);

    if (!purchasedNFT) {
      return;
    } else {
      setSelectedNFT(NFTs.filter((nft) => nft.asset === purchasedNFT)[0]);
    }
  }, []);

  const appearance = {
    theme: "flat",
    variables: {
      colorPrimary: "#59A6EF",
    },
  };
  const options: any = {
    clientSecret,
    appearance,
  };

  const handleMintByCrypto = async (nft: INFT) => {
    if (!walletContext.wallet.address) {
      alert("Please connect to your wallet first");
      return;
    }
    try {
      const nonce = await Web3Provider.selectedProvider.send("eth_getTransactionCount", [walletContext.wallet.address, "latest"]);
      const iface = new ethers.utils.Interface(["function mint(address _address, uint256 _amount)"]);
      const data = iface.encodeFunctionData("mint", [walletContext.wallet.address, 1]);

      const mintTxn = {
        type: 2,
        from: walletContext.wallet.address,
        to: nft.contractAddress,
        nonce: nonce,
        data: data,
        value: "0x38D7EA4C68000",
        chainId: CHAIN_ID,
      };

      await Web3Provider.selectedProvider.provider.connect();
      const txnResult = await Web3Provider.selectedProvider.send("eth_sendTransaction", [mintTxn]);
      setTxnHash(txnResult);
    } catch (error: any) {
      setError({
        status: (error as ICustonomyError).code,
        message: (error as ICustonomyError).message,
      });
    }
  };
  // 2 OPTIONS
  // 1) Mint w. Stripe using Custonomy Mint
  // const handleMintByCard = async (nft: INFT) => {
  //   try {
  //     const stripeClientData = await getStripeClient();
  //     setClientSecret(stripeClientData.clientSecret);
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  //   setSelectedNFT(nft);
  // };
  // 2) Mint w. General Credit Card using Traditional Mint
  const handleMintByCard = (nft: INFT) => {
    setMintingMode({ mode: "creditcard", step: 0 });
    setSelectedNFT(nft);
  };

  const handleWinterOnClose = () => {
    setMintingMode({ mode: "", step: 0 });
    setSelectedNFT(null);
  };

  const handleMintByOneClick = (nft: INFT) => {
    setMintingMode({ mode: "oneclick", step: 0 });
    setSelectedNFT(nft);
  };

  const handleOneClickMintingOnClose = () => {
    setMintingMode({ mode: "", step: 0 });
    setTxnHash("");
    setSelectedNFT(null);
  };

  const handleSnackbarOnClose = () => {
    setTxnHash("");
    setError(null);
  };

  const handleViewTxn = () => {
    window.open(`https://${NETWORK === "mumbai" ? "mumbai." : ""}polygonscan.com/tx/${txnHash}`, "_blank");
  };

  const oneClickCheckout = (nft: INFT, provider: Provider) => {
    let oneClickCheckout = new OneClickCheckout(
      {
        projectId: CUSTONOMY_PROJECT_ID,
        apiKey: CUSTONOMY_API_KEY,
        endPoint: CUSTONOMY_END_POINT,
        session: walletContext.account.user?.session as string,
      },
      provider
    );
    setOneClickStatus({ isLoading: true, txnHash: "" });
    setMintingMode({ mode: "oneclick", step: 1 });

    let orderId: any;
    createIntent({
      chainId: CHAIN_ID,
      contractAddress: nft.contractAddress,
      method: "mint",
      params: [walletContext.wallet.address, 1],
    })
      .then((order) => {
        orderId = order.id;
        return oneClickCheckout.checkout({
          network: "ETHEREUM",
          cryptocurrency: "ETH",
          cryptoAmt: 0.025,
          fiatCurrency: "HKD",
          customOrderId: order.id,
          title: "Purchasing " + nft.name,
        });
      })
      .then(() => {
        let orderInternval: any;
        orderInternval = setInterval(async () => {
          const orderIntent = await getOrderIntent(orderId);
          if (orderIntent.payment_status == "success") {
            clearInterval(orderInternval);
            orderInternval = null;
            setMintingMode({ mode: "oneclick", step: 2 });
            setOneClickStatus({
              isLoading: false,
              txnHash: orderIntent.txn_hash,
            });
            setTxnHash(orderIntent.txn_hash);
          } else if (orderIntent.payment_status == "failed") {
            clearInterval(orderInternval);
            orderInternval = null;
            setMintingMode({ mode: "oneclick", step: 2 });
            setOneClickStatus({
              isLoading: false,
              txnHash: "error",
            });
            setError({
              status: 500,
              message: "Mint failed",
            });
          }
        }, 3000);
      });
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="center" spacing={4}>
        {param === SHOP_PARAM ? (
          <>
            {NFTs.map((nft, index) => (
              <Grid item key={nft.name} xs={12} md={4}>
                <NFTCard
                  nft={nft}
                  onMintByCrypto={() => handleMintByCrypto(nft)}
                  onMintByCard={() => handleMintByCard(nft)}
                  onMintByOneClick={() => handleMintByOneClick(nft)}
                  disabled={walletContext?.wallet?.address === ""}
                />
              </Grid>
            ))}
          </>
        ) : (
          <>
            {NFTs.filter((nft) => nft.name !== "Cool Bear").map((nft, index) => (
              <Grid item key={nft.name} xs={12} md={4}>
                <NFTCard
                  nft={nft}
                  onMintByCrypto={() => handleMintByCrypto(nft)}
                  onMintByCard={() => handleMintByCard(nft)}
                  onMintByOneClick={() => handleMintByOneClick(nft)}
                  disabled={walletContext.wallet.address === ""}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>

      {/* 2 OPTIONS */}
      {/* 1) Mint w. Stripe using Custonomy Mint */}
      {/* {selectedNFT && clientSecret.length > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <StripeModal
            open={Boolean(selectedNFT)}
            onClose={handleWinterOnClose}
            nft={selectedNFT}
          />
        </Elements>
      )} */}
      {/* 2) Mint w. General Credit Card using Traditional Mint */}
      {mintingMode.mode == "creditcard" && selectedNFT && <CreditCardModal open={mintingMode.mode == "creditcard"} onClose={handleWinterOnClose} nft={selectedNFT} />}
      {mintingMode.mode == "oneclick" && selectedNFT && (
        <OneClickModal
          open={mintingMode.mode == "oneclick"}
          onClose={handleOneClickMintingOnClose}
          onCheckout={oneClickCheckout}
          nft={selectedNFT}
          isLoading={oneClickStatus.isLoading}
          step={mintingMode.step}
          txnHash={oneClickStatus.txnHash}
        />
      )}

      <Snackbar open={Boolean(txnHash && !error)} onClose={handleSnackbarOnClose} sx={{ width: "65%" }} autoHideDuration={8000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <StyledAlert
          // className={classes.alert}
          onClose={handleSnackbarOnClose}
          severity="success"
          sx={{ width: "100%" }}
          action={
            <Grid container alignItems="center" p={0}>
              <Button color="inherit" size="small" sx={{ mr: 1 }} onClick={handleViewTxn}>
                View Transaction
              </Button>
              <Link to="/collection">
                <Button color="inherit" size="small" variant="outlined">
                  View NFT
                </Button>
              </Link>
              <IconButton onClick={handleSnackbarOnClose}>
                <CloseIcon />
              </IconButton>
            </Grid>
          }
        >
          Congrats! You have minted the NFT successfully! 🎉
        </StyledAlert>
      </Snackbar>
      <Snackbar open={Boolean(error)} autoHideDuration={5000} onClose={handleSnackbarOnClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleSnackbarOnClose} severity="error" sx={{ width: "100%" }}>
          Error {error?.status}: {error?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ShopPage;
