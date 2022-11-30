import { Alert, Button, Grid, IconButton, Snackbar } from "@mui/material";
import { useContext, useState } from "react";
import NFTCard from "../components/NFTCard";
import { CHAIN_ID, NFTs, Web3Provider } from "../utils/constants";
import { ICustonomyError, INFT } from "../utils/types";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/styles";
import CreditCardModal from "../components/CreditCardModal";

const StyledAlert = styled(Alert)({
  "& .MuiAlert-action": {
    padding: 0,
  },
});

const ShopPage = () => {
  const walletContext = useContext(WalletContext) as IWalletContext;
  const [txnHash, setTxnHash] = useState<string>("");
  const [selectedNFT, setSelectedNFT] = useState<INFT | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);

  const handleMintByCrypto = async (nft: INFT) => {
    // alert and return if wallet has not been connected
    if (!walletContext.wallet.address) {
      alert("Please connect to your wallet first");
      return;
    }
    
    // mint
    try {
      const nonce = await Web3Provider.selectedProvider.send("eth_getTransactionCount", [walletContext.wallet.address, "latest"]);
      const iface = new ethers.utils.Interface(["function mint(address _address, uint256 _amount)"]);
      const data = iface.encodeFunctionData("mint", [walletContext.wallet.address, 1]);
      const mintTxn = {
        type: 0,
        from: walletContext.wallet.address,
        to: nft.contractAddress,
        nonce: nonce,
        data: data,
        value: "0x38D7EA4C68000",
        chainId: CHAIN_ID,
      };
      const txnResult = await Web3Provider.selectedProvider.send("eth_sendTransaction", [mintTxn]);
      setTxnHash(txnResult);
    } catch (error: unknown) {
      setError({ status: (error as ICustonomyError).code, message: (error as ICustonomyError).message });
    }
  };

  const handleMintByCard = (nft: INFT) => {
    setSelectedNFT(nft);
  };

  const handleWinterOnClose = () => {
    setSelectedNFT(null);
  };

  const handleSnackbarOnClose = () => {
    setTxnHash("");
    setError(null);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="center" spacing={4}>
        {NFTs.map((nft) => (
          <Grid item key={nft.name} xs={12} md={4}>
            <NFTCard nft={nft} onMintByCrypto={() => handleMintByCrypto(nft)} onMintByCard={() => handleMintByCard(nft)} />
          </Grid>
        ))}
      </Grid>
      {selectedNFT && <CreditCardModal open={Boolean(selectedNFT)} onClose={handleWinterOnClose} nft={selectedNFT} />}
      <Snackbar
        open={Boolean(txnHash && !error)}
        onClose={handleSnackbarOnClose}
        sx={{ width: "65%" }}
        autoHideDuration={8000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <StyledAlert
          onClose={handleSnackbarOnClose}
          severity="success"
          sx={{ width: "100%" }}
          action={
            <Grid container alignItems="center" p={0}>
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
