import { Button, Grid, Typography, CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MintedNFTCard from "../components/MintedNFTCard";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import { ALCHEMY_API_KEY, NETWORK, NFTs } from "../utils/constants";
import { IOwnedNFT } from "../utils/types";

const CollectionPage = () => {
  const walletContext = useContext(WalletContext) as IWalletContext;
  const [mintedNFTs, setMintedNFTs] = useState<IOwnedNFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (walletContext.wallet.address) getMintedNFTs();
  }, [walletContext.wallet.address]);

  const getMintedNFTs = () => {
    setIsLoading(true);
    const filterContracts = NFTs.reduce((prev, current) => `${prev}&contractAddresses\[\]=${current.contractAddress}`, "");
    NFTs.map((nft) => nft.contractAddress);
    fetch(
      `https://polygon-${NETWORK === "mumbai" ? NETWORK : "mainnet"}.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTs?owner=${walletContext.wallet.address}${filterContracts}&withMetadata=true`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.ownedNfts) setMintedNFTs(response.ownedNfts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      <Typography variant={isTablet ? "h5" : "h4"} fontWeight="bold" mb={3}>
        Your NFT Collection
      </Typography>
      {mintedNFTs.length > 0 ? (
        <Grid container spacing={5}>
          {mintedNFTs.map((nft, index) => (
            <Grid item xs={6} md={4} key={index}>
              <MintedNFTCard nft={nft} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container flexDirection="column" alignItems="center" justifyContent="center" minHeight={300}>
          {isLoading ? (
            <CircularProgress sx={{ mt: 8 }} />
          ) : (
            <>
              <Typography variant="h5">No minted NFTs 😕</Typography>
              <Link to="/shop">
                <Button variant="contained" sx={{ mt: 2 }}>
                  👉 Mint a NFT from the Shop
                </Button>
              </Link>
            </>
          )}
        </Grid>
      )}
    </>
  );
};

export default CollectionPage;
