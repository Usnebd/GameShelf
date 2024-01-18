import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import { CssBaseline, useMediaQuery } from "@mui/material";
import React from "react";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: indigo,
          secondary: amber,
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar></Navbar>
    </ThemeProvider>
  );
}

export default App;
