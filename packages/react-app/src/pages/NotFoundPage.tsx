import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box component="div" textAlign="center">
      <img src="https://cdn-icons-png.flaticon.com/512/7486/7486797.png" width={400} alt="not found" />
      <Typography variant="h4" color="white" fontWeight="bold">
        Oops! Page Not Found!
      </Typography>
      <Link to="/">
        <Button variant="contained" sx={{ mt: 5 }}>
          Back to Home
        </Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
