import { Box, CircularProgress } from "@mui/material";

const LoadingBackground = () => {
  return (
    <Box
      component="div"
      width="100%"
      height="100%"
      bgcolor="#000"
      position="fixed"
      top={0}
      bottom={0}
      sx={{ opacity: 0.8, zIndex: 999 }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingBackground;
