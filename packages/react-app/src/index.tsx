import "./index.css";
import { createRoot } from "react-dom/client";
import React from "react";
// import ReactDOM from "react-dom";

import App from "./App";
import { ThemeProvider } from "@emotion/react";
import { customTheme } from "./utils/theme";
import { WalletProvider } from "./context/WalletContext";

// Change this to your own Infura project id: https://infura.io/register
// const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={customTheme}>
    <WalletProvider>
      <App />
    </WalletProvider>
  </ThemeProvider>
);

// ReactDOM.render(
//   <React.StrictMode>
//     <ThemeProvider theme={customTheme}>
//       {/* <DAppProvider config={config}> */}
//         <WalletProvider>
//           <App />
//         </WalletProvider>
//       {/* </DAppProvider> */}
//     </ThemeProvider>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
