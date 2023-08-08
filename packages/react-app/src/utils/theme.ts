import { createTheme } from "@mui/material/styles";

export const customTheme = createTheme({
  typography: {
    fontFamily: "'Lato', sans-serif",
    allVariants: {
      color: "rgb(49, 81, 104)",
    },
  },
  palette: {
    primary: { main: "#00538C", contrastText: "white", light: "#e7f5fe" },
    common: { black: "rgba(0, 0, 0, 0.54)" },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: "rgba(245, 255, 255, 0.59)",
          borderRadius: 20,
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px;",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', sans-serif",
        },
      },
    },
  },
});
