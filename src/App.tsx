import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import {
  Box,
  Container,
  CssBaseline,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: indigo,
          secondary: amber,
          mode: mode ? "dark" : "light",
        },
        typography: {
          fontFamily: "Quicksand",
          fontWeightLight: 400,
          fontWeightRegular: 500,
          fontWeightMedium: 600,
          fontWeightBold: 700,
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="header">
        <Navbar mode={mode} toggleMode={toggleMode} />
        <Toolbar />
      </Box>
      <Container>
        <Box component="main" p={3}>
          <Outlet />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
