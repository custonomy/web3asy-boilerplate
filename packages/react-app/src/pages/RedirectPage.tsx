import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { STORAGE_KEY } from "../utils/constants";

const RedirectPage = () => {
  const { token } = useParams();

  useEffect(() => {
    if (window.opener) {
      window.opener.focus();
    }

    if (token) {
      localStorage.setItem(STORAGE_KEY.TOKEN, token);
    }
    window.close();
  }, []);

  return <Typography variant="h6">Redirecting...</Typography>;
};

export default RedirectPage;
