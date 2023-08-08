import {
  Grid,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NETWORK } from "../utils/constants";
import { keyframes } from "@emotion/react";

interface MintedNFTCardProps {
  nft: any;
}

const float = keyframes`
  0% {
    boxShadow: 0 5px 15px 0px rgba(0, 83, 138, 0.4);
    transform: translateY(0px);
  },
  50% {
    boxShadow: 0 25px 15px 0px rgba(0, 83, 138, 0.4);
    transform: translateY(-15px);
  },
  100% {
    boxShadow: 0 5px 15px 0px rgba(0, 83, 138, 0.4);
    transform: translateY(0px);
  },
`;

const StyledImage = styled("img")({
  cursor: "pointer",
  borderRadius: 10,
  margin: "auto",
  transition: "0.3s all",
  "&:hover": {
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 83, 138, 0.4) 0px 10px 10px",
    animation: `${float} 3s ease-in-out infinite`,
  },
});

const MintedNFTCard: React.FC<MintedNFTCardProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleViewNFT = () => {
    window.open(
      `https://${NETWORK === "mumbai" ? "mumbai." : ""}polygonscan.com/token/${
        props.nft?.contract?.address
      }?a=${parseInt(props.nft?.id?.tokenId, 16)}`
    );
  };

  const parseIPFSUrl = (url: string) => {
    return url?.replace("ipfs://", "https://ipfs.io/ipfs/") ?? "";
  };

  return (
    <Grid container flexDirection="column" justifyContent="center">
      <StyledImage
        // src={parseIPFSUrl(props.nft?.metadata?.image)}
        src={props.nft?.media[0]?.gateway}
        alt={props.nft?.name}
        height={isMobile ? 200 : 300}
        onClick={handleViewNFT}
      />
      <Typography variant="h5" textAlign="center" pt={2}>
        {props.nft?.title} #{parseInt(props.nft?.id?.tokenId, 16)}
      </Typography>
    </Grid>
  );
};

export default MintedNFTCard;
