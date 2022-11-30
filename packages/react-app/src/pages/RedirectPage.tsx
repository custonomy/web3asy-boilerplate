import { Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EStorageKey } from "../utils/constants";

const RedirectPage = () => {
  const { token } = useParams();

  useEffect(() => {
    if (window.opener) {
      window.opener.focus();
    }

    if (token) {
      localStorage.setItem(EStorageKey.TOKEN, token);
    }
    window.close();
  }, []);

  return <Typography variant="h6">Redirecting...</Typography>;
};

export default RedirectPage;
