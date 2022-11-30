import { useContext } from "react";
import { Navigate } from "react-router-dom";
import WalletContext, { IWalletContext } from "../context/WalletContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }): React.ReactElement => {
  const walletContext = useContext(WalletContext) as IWalletContext;

  if (!walletContext.wallet.address) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
