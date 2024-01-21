import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import { Box, Container, CssBaseline, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "./custom_hook/useLocalStorage";

function App() {
  const { setItem, getItem } = useLocalStorage("theme");
  const savedPreferences = getItem();
  const systemSetting = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(
    savedPreferences != undefined ? savedPreferences : systemSetting
  );
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
    setMode((prevMode: boolean) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar mode={mode} toggleMode={toggleMode} setItem={setItem} />
      <Box component="main" mt={5}>
        <Container>
          <Outlet />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
