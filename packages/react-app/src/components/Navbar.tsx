import LogoWhite from "../assets/metaWONDERverseWhite.png";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  Grid,
  styled,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import ConnectModal from "./ConnectModal";
import { logout } from "../apis";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import RoundedButton from "./RoundedButton";
import ChangePasswordModal from "./ChangePasswordModal";
import { INavItem, IUser } from "../utils/types";
import { config } from "../config/env";
import { EWalletType, EFormType } from "../utils/constants";

const INDEX = 5;
const CLAMP_SYMBOL = "...";
const DRAWER_WIDTH = 240;
const NAV_ITEMS: INavItem[] = [
  { name: "ABOUT", permission: "public", link: "/about" },
  { name: "SHOP", permission: "public", link: "/shop" },
  { name: "MY COLLECTION", permission: "private", link: "/collection" },
];

const MenuButton = styled(Button)(({ theme }) => ({
  color: "#fff !important",
  marginInline: "5px !important",
  "&:hover": {
    backgroundColor: "rgba(0, 83, 138, 0.4) !important",
  },
}));

const Navbar = () => {
  const container = window !== undefined ? () => window.document.body : undefined;
  const walletContext = useContext(WalletContext) as IWalletContext;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
  const [changePasswordResult, setChangePasswordResult] = useState<string>("");
  const [filteredNavItems, setFilteredNavItems] = useState(NAV_ITEMS);

  useEffect(() => {
    if (walletContext.wallet.address) {
      setFilteredNavItems(NAV_ITEMS);
    } else {
      setFilteredNavItems(NAV_ITEMS.filter((item) => item.permission === "public"));
    }
  }, [walletContext.wallet.address]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = config.CUSTONOMY_WIDGET_URL ?? "";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const showWidget = useMemo(
    () => Boolean(!walletContext.isLoading && walletContext.wallet.type === EWalletType.CUSTONOMY && walletContext.wallet.address && walletContext.account.user?.session),
    [walletContext.isLoading, walletContext.wallet, walletContext.account.user?.session]
  );

  const handleMenuButtonOnClick = (item: INavItem) => {
    handleDrawerToggle();
    navigate(item.link);
  };

  const handleListItemOnClick = (item: { name: string; link: string }) => {
    handleDrawerToggle();
    navigate(item.link);
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
    setChangePasswordResult("");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    // close the drawer if it is opened
    if (mobileOpen) {
      handleDrawerToggle();
    }
    await logout();
    walletContext.reset();
    navigate("/");
  };

  const handleChangePwModalOnClose = (message?: string) => {
    if (message) setChangePasswordResult(message); // pass the message from ChangePasswordModal to ConnectModal
    setOpenChangePassword(!openChangePassword);
    handleLogout();
    setModalOpen(!modalOpen);
  };

  const handleLoginSuccess = (user: IUser) => {
    if (user.firstTimeLogin && user.type === "INTERNAL") {
      setOpenChangePassword(true);
    }
  };

  const drawer = (
    <Box sx={{ textAlign: "center" }} component="div">
      <List>
        <Link to="/">
          <ListItem disablePadding onClick={handleDrawerToggle}>
            <ListItemButton>
              <ListItemText primary="HOME" />
            </ListItemButton>
          </ListItem>
        </Link>
        {filteredNavItems.map((item) => (
          <Box component="div" key={item.name}>
            <ListItem disablePadding onClick={() => handleListItemOnClick(item)}>
              <ListItemButton>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          </Box>
        ))}
        {walletContext.wallet.type && walletContext.wallet.address && (
          <>
            <Divider />
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" /> <LogoutIcon />
            </ListItemButton>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }} component="div" mb={4}>
      <AppBar component="nav" sx={{ backgroundColor: "rgba(0, 83, 138, 0.63)" }}>
        <Toolbar sx={{ justifyContent: "space-between", pr: { xs: 0, md: 1 } }}>
          <Grid container alignItems="center">
            <Link to="/">
              <img src={LogoWhite} alt="metaWONDERverse" height={isMobile ? 20 : 30} />
            </Link>
          </Grid>
          <Box sx={{ display: { xs: "none", md: "flex" } }} component="div">
            {filteredNavItems.map((item) => (
              <Box component="div" key={item.name}>
                <MenuButton sx={{ width: item.name === "MY COLLECTION" ? 140 : "auto" }} onClick={() => handleMenuButtonOnClick(item)}>
                  {item.name}
                </MenuButton>
              </Box>
            ))}
          </Box>
          <Box component="div" display="flex" justifyContent="flex-end">
            <div id="custonomy_widget" style={{ display: showWidget ? "block" : "none", transform: isMobile ? "scale(0.9)" : "scale(1)" }}></div>
          </Box>
          {walletContext.isLoading ? (
            <Typography textTransform="uppercase" color="#fff" fontSize={14}>
              Loading...
            </Typography>
          ) : (
            <>
              {walletContext.wallet.type === EWalletType.METAMASK && walletContext.wallet.address && (
                <RoundedButton variant="contained" sx={{ width: 250, mx: 1 }} color="primary" size={isMobile ? "small" : "medium"}>
                  {walletContext.wallet.address.substring(0, INDEX) + CLAMP_SYMBOL + walletContext.wallet.address.substring(walletContext.wallet.address.length - INDEX)}
                </RoundedButton>
              )}

              {!walletContext.wallet.address && !walletContext.account.user?.session && (
                <RoundedButton variant="contained" sx={{ width: 180 }} onClick={handleModalToggle} color="primary">
                  Login
                </RoundedButton>
              )}
              {walletContext.wallet.type && walletContext.wallet.address && (
                <IconButton onClick={handleLogout} sx={{ color: "white", display: { xs: "none", md: "flex" }, marginInline: 1 }}>
                  <LogoutIcon />
                </IconButton>
              )}
            </>
          )}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginInline: { xs: 1, md: 5 }, mr: { xs: 1 }, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          anchor="right"
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: DRAWER_WIDTH, backgroundColor: "rgba(213, 234, 248, 0.9)" },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      {modalOpen && (
        <ConnectModal
          open={modalOpen}
          onClose={handleModalToggle}
          mode={changePasswordResult ? EFormType.LOGIN : EFormType.REGISTER}
          alertMessage={changePasswordResult}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {openChangePassword && <ChangePasswordModal open={openChangePassword} onClose={handleChangePwModalOnClose} />}
    </Box>
  );
};

export default Navbar;
