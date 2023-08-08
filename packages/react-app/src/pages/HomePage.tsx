import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import NFTsImage from "../assets/nfts.png";

const HomePage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container justifyContent="space-between">
      <Grid item xs={12} md={6} minHeight={{ xs: 0, md: 500 }} display="flex" alignItems="center" textAlign="center" justifyContent="center" flexDirection={'column'}>
        <Typography
          fontSize={isMobile ? 18 : isTablet ? 22 : 30}
          fontFamily="'Press Start 2P', cursive"
          textAlign="left"
          lineHeight={1.5}
          width={isMobile ? '330px' : isTablet ? '425px' : '100%'}
          maxWidth={'630px'}
          color="white"
          py={isMobile ? 1 : isTablet ? 3 : 0}
          paddingBottom='25px'
        >
          Journey to<br />
          meta.WONDER.verse
        </Typography>
        <Typography
          fontSize={isMobile ? 12 : isTablet ? 16 : 18}
          fontFamily="monospace"
          textAlign="left"
          lineHeight={1.5}
          width={isMobile ? '330px' : isTablet ? '425px' : '100%'}
          maxWidth={'630px'}
          color="white"
          py={isMobile ? 1 : isTablet ? 3 : 0}
          >
          metaWONDERverse is a captivating demo site that showcases the potential of <a href="https://custonomy.io/web3asy" target='_blank'>Custonomy Web3asy</a>. Web3asy, a non-custodial MPC wallet with simple login and without seed phases, simplifies user adoption of web3 technology. Visit now to learn more about web3asy and its seamless integration into your digital journey.
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} textAlign="center">
        <img src={NFTsImage} alt="nfts" width={isMobile ? 300 : isDesktop ? 450 : 600} />
      </Grid>
    </Grid>
  );
};

export default HomePage;
