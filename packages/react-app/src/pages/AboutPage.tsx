import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import NFTModel from "../components/NFTModel";
import { NFTs } from "../utils/constants";

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box component="div" sx={{ background: "#FFFFFF99" }} p={3} mt={3}>
        <Typography variant={isMobile ? "h5" : "h4"} textAlign="center" fontWeight="bold">
          ABOUT OUR "C" ANIMAL NFTs
        </Typography>
        <Typography variant="body1" my={3} ml={3}>
          Custonomy is always dedicated to help enterprises to usher in a new era of Web3 with its latest digital asset wallet solution. We are happy to launch our metaWONDERverse
          to showcase our development. To provide a better understanding of how our solution is capable of accelerating the mass adoption of digital assets, we are issuing a series
          of three NFTs for the public to mint and experience our easy-to-use keyless wallet for community members.
        </Typography>
        <Typography variant="body1" my={3} ml={3}>
          By simply creating your own MPC wallet, you can mint the following three different NFTs to experience the high flexibility of our wallet and also gain more benefits from
          the engagement that you won't want to miss.
        </Typography>
        <Typography variant="body1" my={3} ml={3}>
          These are the animal NFTs that you can mint on metaWONDERverse:
        </Typography>
        <Grid container justifyContent="space-evenly" alignContent="center" spacing={2}>
          {NFTs.map((nft) => (
            <Grid item key={nft.name} md={4} pb={2}>
              <Typography variant="h5" textTransform="uppercase" fontWeight="bold" textAlign="center">
                {nft.name}
              </Typography>
              <NFTModel model={nft.model} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default AboutPage;
