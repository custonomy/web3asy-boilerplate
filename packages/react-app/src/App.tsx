import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RedirectPage from "./pages/RedirectPage";
import ShopPage from "./pages/ShopPage";
import { Suspense, useContext, useEffect } from "react";
import AboutPage from "./pages/AboutPage";
import CollectionPage from "./pages/CollectionPage";
import WalletContext, { IWalletContext } from "./context/WalletContext";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const walletContext = useContext(WalletContext) as IWalletContext;

  useEffect(() => {
    walletContext.updateAddressProvider();
  }, []);

  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <Navbar />
        <Box component="main" padding={3} pt={7}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/redirect/:token" element={<RedirectPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route
              path="/collection"
              element={
                <ProtectedRoute>
                  <CollectionPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </Suspense>
  );
};

export default App;
