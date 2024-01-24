import { createContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import {
  Box,
  Container,
  CssBaseline,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "./custom_hook/useLocalStorage";
import Dial from "./components/Dial";
import { auth } from "./components/firebase-conf";
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext({
  user: auth.currentUser,
  handleUser: () => {},
});

export const SnackBarContext = createContext({
  handleSnackbarOpen: () => {},
  handleSnackMessage: (_msg: string) => {},
});

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
        components: {
          MuiTabs: {
            styleOverrides: {
              indicator: {
                height: 3,
              },
            },
          },
          MuiSpeedDialAction: {
            styleOverrides: {
              staticTooltipLabel: {
                color: mode ? "white" : "black",
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prevMode: boolean) => !prevMode);
  };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const handleSnackbarOpen: () => void = () => setSnackbarOpen(true);
  const handleSnackbarClose: () => void = () => setSnackbarOpen(false);
  const handleSnackMessage: (msg: string) => void = (msg) => setMessage(msg);
  const [user, setUser] = useState(auth.currentUser);
  const handleUser: () => void = () => setUser(auth.currentUser);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthContext.Provider value={{ user, handleUser }}>
        <SnackBarContext.Provider
          value={{
            handleSnackbarOpen,
            handleSnackMessage,
          }}
        >
          <CssBaseline />
          <Navbar mode={mode} toggleMode={toggleMode} setItem={setItem} />
          <Box component="main" mt={5}>
            <Container>
              <Outlet />
            </Container>
          </Box>
          <Dial mode={mode} toggleMode={toggleMode} setItem={setItem} />
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            message={message}
            onClose={handleSnackbarClose}
          />
        </SnackBarContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
