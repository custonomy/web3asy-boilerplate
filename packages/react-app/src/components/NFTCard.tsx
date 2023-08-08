import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { INFT } from "../utils/types";
import NFTModel from "./NFTModel";
import RoundedButton from "./RoundedButton";

interface NFTCardProps {
  nft: INFT;
  onMintByCrypto?: () => void;
  onMintByCard?: () => void;
  onMintByOneClick?: () => void;
  disabled?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Grid container textAlign="center" spacing={1}>
      <Grid item xs={6} md={12}>
        <NFTModel model={props.nft.model} />
      </Grid>
      <Grid
        item
        xs={6}
        md={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box component="div">
          <Typography variant={isMobile ? "h5" : "h4"} py={2} fontWeight="bold">
            {props.nft.name}
          </Typography>
          {props.onMintByCard && props.onMintByCrypto && props.onMintByOneClick ? (
            <Grid container alignItems="center" justifyContent="center" spacing={1} mt={3}>
              <Grid item>
                <RoundedButton variant="contained" sx={{ textTransform: "none" }} onClick={props.onMintByCrypto} color="info" size={isMobile ? "small" : "medium"} disabled={!!props.disabled}>
                  Mint with Cypto
                </RoundedButton>
              </Grid>
              {/* <Grid item>
                <RoundedButton
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={props.onMintByCard}
                  color="info"
                  size={isMobile ? "small" : "medium"}
                  disabled={!!props.disabled}
                >
                  Mint with Card
                </RoundedButton>
              </Grid> */}
              <Grid item>
                <RoundedButton variant="contained" sx={{ textTransform: "none" }} onClick={props.onMintByOneClick} color="info" size={isMobile ? "small" : "medium"} disabled={!!props.disabled}>
                  Mint with One Click
                </RoundedButton>
              </Grid>
            </Grid>
          ) : (
            <Typography variant={isMobile ? "h6" : "h5"} py={2}>
              {props.nft.usage}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default NFTCard;
