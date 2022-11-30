import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { customTheme } from "./utils/theme";
import { WalletProvider } from "./context/WalletContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={customTheme}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </ThemeProvider>
);
