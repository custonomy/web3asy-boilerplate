import { createContext, useEffect, useState } from "react";
import { authUser, verify } from "../apis";
import { CHAIN_ID, CUSTONOMY_PROJECT_ID, Web3Provider, custonomyProvider, EStorageKey, EUserType, EWalletType } from "../utils/constants";
import { getJWT } from "../utils/helpers";
import { IAccount, IUser, IWallet } from "../utils/types";

const INIT_ACCOUNT: IAccount = {
  projectId: CUSTONOMY_PROJECT_ID,
  chainId: CHAIN_ID,
  user: { id: "", email: "", session: "", externalId: "", firstTimeLogin: false, type: null },
};
const INIT_WALLET: IWallet = { type: "", address: "" };
export interface IWalletContext {
  wallet: IWallet;
  account: IAccount;
  isLoading: boolean;
  reset: Function;
  setAccount: React.Dispatch<React.SetStateAction<IAccount>>;
  setWallet: React.Dispatch<React.SetStateAction<IWallet>>;
  updateAddressProvider: Function;
}
export const WalletContext = createContext<IWalletContext | null>(null);
interface WalletProviderProps {
  children: React.ReactNode;
}
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState(INIT_WALLET);
  const [account, setAccount] = useState(INIT_ACCOUNT);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // reset global states
  const reset = async () => {
    localStorage.removeItem(EStorageKey.USER);
    localStorage.removeItem(EStorageKey.TOKEN);
    localStorage.removeItem(EStorageKey.WALLET_TYPE);
    setAccount(INIT_ACCOUNT);
    setWallet(INIT_WALLET);

    if (window.custonomy?.address) {
      custonomyProvider.disconnect();
    }
  };

  if (Web3Provider?.selectedProvider?.provider) {
    Web3Provider.selectedProvider.provider.on("chainChanged", (chainId: string) => console.log({ chainId }));
    Web3Provider.selectedProvider.provider.on("accountsChanged", (newAddress: string) => console.log({ newAddress }));
  }

  // save user info for restoring on refresh
  useEffect(() => {
    localStorage.setItem(EStorageKey.USER, JSON.stringify(account.user));
  }, [account.user]);

  // save wallet type for restoring on refresh
  useEffect(() => {
    localStorage.setItem(EStorageKey.WALLET_TYPE, wallet.type);
  }, [wallet.type]);

  const updateAddressProvider = async () => {
    // get saved info from localStorage
    const savedWalletType = localStorage.getItem(EStorageKey.WALLET_TYPE);
    const savedUser = JSON.parse(localStorage.getItem(EStorageKey.USER) ?? "{}");
    const savedToken = localStorage.getItem(EStorageKey.TOKEN) ?? "";

    setIsLoading(true);
    let updatedUser: IUser | null = null; // to store verified and most updated user info -> determine if the user is really logged in

    // NOTE: window variables takes time to update, as it is initalized only if the widget is ready
    // verify saved user (if have) first
    await new Promise<void>(async (resolve) => {
      if (savedUser) {
        let newAccount = { ...account, user: savedUser };
        try {
          // verify external user
          if (savedUser?.externalId && savedUser?.type !== EUserType.INTERNAL) {
            updatedUser = await authUser();
          } else if (savedUser?.type === EUserType.INTERNAL) {
            // verify internal user
            const verifiedUser = await verify(getJWT(savedToken));
            updatedUser = { ...verifiedUser, session: savedToken };
          }

          // if user is verified -> set to account state
          if (updatedUser) {
            newAccount = { ...account, user: updatedUser };
          }
          // update account state
          setAccount(newAccount);
        } catch (err) {
          // if any error during verification -> logout
          console.error(err);
          reset();
        }
      }
      resolve();
    });

    // then check if window.custonomy or window.ethereum has be initialized -> get address -> restore wallet
    const newWallet = { ...INIT_WALLET };
    setTimeout(async () => {
      await new Promise<void>(async (resolve) => {
        // if window.custonomy exists and has verified user session -> update custonomy wallet info
        if (updatedUser) {
          // update & connect custonomy provider
          custonomyProvider.session = updatedUser.session;
          Web3Provider.selectedProvider = custonomyProvider;
          newWallet.type = EWalletType.CUSTONOMY;
          await custonomyProvider.connect();

          // get address if have
          if (window.custonomy?.address) {
            newWallet.address = window.custonomy?.address;
          }
        }
        // if window.ethereum exists and has saved wallet type as metamask -> update metamask wallet info
        else if (window.ethereum?.selectedAddress && savedWalletType === EWalletType.METAMASK) {
          newWallet.address = window.ethereum?.selectedAddress;
          newWallet.type = EWalletType.METAMASK;
        }

        // if address is retrieved from window -> update address; else reset global states
        if (newWallet.address) {
          setWallet(newWallet);
        } else {
          reset();
        }
        resolve();
      });

      setIsLoading(false);
    }, 1000);
  }

  const state = {
    wallet,
    account,
    isLoading,
    reset,
    setAccount,
    setWallet,
    updateAddressProvider,
  };

  // wrap the application in the provider with the initialized context
  return <WalletContext.Provider value={state}>{children}</WalletContext.Provider>;
};

export default WalletContext;
