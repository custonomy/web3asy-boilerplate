import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import NFTsImage from "../assets/nfts.png";

const HomePage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={12} md={6} minHeight={{ xs: 0, md: 500 }} display="flex" alignItems="center" textAlign="center" justifyContent="center">
        <Typography
          fontSize={isMobile ? 18 : isTablet ? 22 : 30}
          fontFamily="'Press Start 2P', cursive"
          textAlign="center"
          lineHeight={1.5}
          color="white"
          py={isMobile ? 1 : isTablet ? 3 : 0}
        >
          Journey <br />
          To The metaWONDERverse
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} textAlign="center">
        <img src={NFTsImage} alt="nfts" width={isMobile ? 300 : isDesktop ? 450 : 600} />
      </Grid>
    </Grid>
  );
};

export default HomePage;
