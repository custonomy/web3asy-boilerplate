import LogoWhite from "../assets/metaWONDERverse.png";
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
  Menu,
  MenuItem,
  Collapse,
  Typography,
  Divider,
  Select,
  Alert,
  SelectChangeEvent,
  Snackbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import WalletContext, { IWalletContext } from "../context/WalletContext";
import ConnectModal from "./ConnectModal";
import { logout } from "../apis";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import RoundedButton from "./RoundedButton";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  CUSTONOMY_API_KEY,
  CUSTONOMY_END_POINT,
  WALLET_TYPE,
  CUSTONOMY_WIDGET_URL,
  EWalletType,
  EFormType,
  SUPPORTED_CHAINS,
  Web3Provider,
} from "../utils/constants";
import { IUser } from "../utils/types";
import React from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const INDEX = 5;
const CLAMP_SYMBOL = "...";
const drawerWidth = 240;
const navItems = [
  { name: "ABOUT", permission: "public", link: "/about" },
  { name: "SHOP", permission: "public", link: "/shop" },
  { name: "MY COLLECTION", permission: "private", link: "/collection" },
];
const menuItems = [
  { name: `OUR "C" ANIMAL`, link: "/about/intro" },
  { name: "RULES", link: "/about/rules" },
  { name: "SCHEDULE", link: "/about/schedule" },
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openCollapse, setOpenCollapse] = useState(true);
  const [filteredNavItems, setFilteredNavItems] = useState(navItems);
  const open = Boolean(anchorEl);
  const [selectedChain, setSelectedChain] = useState<string>("0x13881");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletContext.wallet.address) {
      setFilteredNavItems(navItems);
    } else {
      setFilteredNavItems(
        navItems.filter((item) => item.permission === "public")
      );
    }
  }, [walletContext.wallet.address]);

  useEffect(() => {
    const script = document.createElement("script");
    console.log(CUSTONOMY_WIDGET_URL);
    script.src = CUSTONOMY_WIDGET_URL ?? "";
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const showWidget = useMemo(
    () =>
      Boolean(
        !walletContext.isLoading &&
          walletContext.wallet.type === EWalletType.CUSTONOMY &&
          walletContext.wallet.address &&
          walletContext.account.user?.session
      ),
    [
      walletContext.isLoading,
      walletContext.wallet,
      walletContext.account.user?.session,
    ]
  );

  const showLogin = useMemo(
    () =>
      !walletContext.wallet.address &&
      !walletContext.account.user?.session &&
      !walletContext.wallet.type,
    [
      walletContext.wallet.address,
      walletContext.account.user?.session,
      walletContext.wallet.type,
    ]
  );

  const handleMenuOnOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuOnClick = (link: string) => {
    navigate(link);
    handleDrawerToggle();
  };

  const handleMenuOnClose = () => {
    setAnchorEl(null);
  };

  const handleMenuButtonOnClick = (
    event: React.MouseEvent<HTMLElement>,
    item: { name: string; permission: string; link: string }
  ) => {
    // if (item.name === "ABOUT") {
    //   handleMenuOnOpen(event);
    // } else {
    navigate(item.link);
    // }
  };

  const handleNestedListItemOnClick = (
    event: React.MouseEvent<HTMLElement>,
    item: { name: string; link: string }
  ) => {
    // setOpenCollapse(false);
    handleDrawerToggle();
    navigate(item.link);
  };

  const handleModalToggle = () => {
    setModalOpen(!modalOpen);
    setChangePasswordResult("");
  };

  const handleLogout = async () => {
    if (mobileOpen) {
      handleDrawerToggle();
    }
    await logout();
    walletContext.reset();
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangePwModalOnClose = (message?: string) => {
    if (message) setChangePasswordResult(message);
    setOpenChangePassword(!openChangePassword);
    handleLogout();
    setModalOpen(!modalOpen);
  };

  const handleLoginSuccess = (user: IUser) => {
    if (user.firstTimeLogin && user.type === "INTERNAL") {
      setOpenChangePassword(true);
    }
  };

  const handleListItemOnClick = (item: { name: string; link: string }) => {
    // if (item.name === "ABOUT") {
    //   setOpenCollapse(!openCollapse);
    // } else {
    handleDrawerToggle();
    navigate(item.link);
    // }
  };

  const handleChainOnChange = async (event: SelectChangeEvent) => {
    const chainId = event.target.value as string;
    try {
      await Web3Provider.selectedProvider.send("wallet_switchEthereumChain", [
        { chainId },
      ]);
      setSelectedChain(chainId);
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const handleSnackbarOnClose = () => {
    setError(null);
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
            <ListItem
              disablePadding
              onClick={() => handleListItemOnClick(item)}
            >
              <ListItemButton>
                <ListItemText primary={item.name} />
                {/* {item.name === "ABOUT" && <>{openCollapse ? <ExpandLess /> : <ExpandMore />}</>} */}
              </ListItemButton>
            </ListItem>
            {/* {item.name === "ABOUT" && (
              <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menuItems.map((item) => (
                    <ListItemButton sx={{ pl: 4 }} key={item.name} onClick={(e) => handleNestedListItemOnClick(e, item)}>
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )} */}
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
      <AppBar
        component="nav"
        sx={{ backgroundColor: "rgba(0, 83, 138, 0.63)" }}
      >
        <Toolbar sx={{ justifyContent: "space-between", pr: { xs: 0, md: 1 } }}>
          <Grid container alignItems="center">
            <Link to="/">
              <img
                src={LogoWhite}
                alt="metaWONDERverse"
                height={isMobile ? 20 : 30}
              />
            </Link>
          </Grid>
          <Box sx={{ display: { xs: "none", md: "flex" } }} component="div">
            {filteredNavItems.map((item) => (
              <Box component="div" key={item.name}>
                <MenuButton
                  sx={{ width: item.name === "MY COLLECTION" ? 140 : "auto" }}
                  onClick={(e) => handleMenuButtonOnClick(e, item)}
                >
                  {item.name}
                </MenuButton>
                {/* {item.name === "ABOUT" && (
                  <Menu anchorEl={anchorEl} open={open} onClose={handleMenuOnClose}>
                    {menuItems.map((item) => (
                      <MenuItem key={item.name} onClick={() => handleMenuOnClick(item.link)}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Menu>
                )} */}
              </Box>
            ))}
          </Box>
          {/* test for changing chain only */}
          {/* <Select
            value={selectedChain}
            label="Chain"
            onChange={handleChainOnChange}
            variant="standard"
            sx={{ marginRight: 2, color: "white" }}
          >
            {Object.keys(SUPPORTED_CHAINS).map((chainId: string) => (
              <MenuItem key={chainId} value={chainId}>
                {SUPPORTED_CHAINS[chainId]?.name}
              </MenuItem>
            ))}
          </Select> */}
          <Box component="div" display="flex" justifyContent="flex-end">
            <div
              id="custonomy_widget"
              //  display: wallet.account.projectId && wallet.account.user.id && !window.ethereum.address ? "block" : "none"
              style={{
                display: showWidget ? "block" : "none",
                transform: isMobile ? "scale(0.9)" : "scale(1)",
              }}
            ></div>
          </Box>
          {walletContext.isLoading ? (
            <Typography textTransform="uppercase" color="#fff" fontSize={14}>
              Loading...
            </Typography>
          ) : (
            <>
              {walletContext.wallet.type === WALLET_TYPE.METAMASK &&
                walletContext.wallet.address && (
                  <RoundedButton
                    variant="contained"
                    sx={{ width: 250, mx: 1 }}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  >
                    {walletContext.wallet.address?.substring(0, INDEX) +
                      CLAMP_SYMBOL +
                      walletContext.wallet.address?.substring(
                        walletContext.wallet.address?.length - INDEX
                      )}
                  </RoundedButton>
                )}
              {/*  && !wallet.address && !wallet.account.user.session */}
              {showLogin && (
                <RoundedButton
                  variant="contained"
                  sx={{ width: 180 }}
                  onClick={handleModalToggle}
                  color="primary"
                >
                  Login
                </RoundedButton>
              )}
              {walletContext.wallet.type && walletContext.wallet.address && (
                <IconButton
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    display: { xs: "none", md: "flex" },
                    marginInline: 1,
                  }}
                >
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
            sx={{
              marginInline: { xs: 0, sm: 1, md: 5 },
              mr: { xs: 1 },
              display: { md: "none" },
            }}
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
          open={mobileOpen || open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "rgba(213, 234, 248, 0.9)",
            },
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
      {openChangePassword && (
        <ChangePasswordModal
          open={openChangePassword}
          onClose={handleChangePwModalOnClose}
        />
      )}
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={handleSnackbarOnClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarOnClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Navbar;
