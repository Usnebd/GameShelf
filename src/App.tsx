import { createContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "./custom_hook/useLocalStorage";
import Dial from "./components/Dial";
import { auth } from "./components/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { SnackbarProvider } from "notistack";

interface SelectedItem {
  category: string;
  productName: string;
}

export const UserContext = createContext({
  user: auth.currentUser,
  handleUser: () => {},
  selectedItems: [] as SelectedItem[],
  setSelectedItems: (
    _: SelectedItem[] | ((prevItems: SelectedItem[]) => SelectedItem[])
  ) => {},
});

function App() {
  const { setItem, getItem } = useLocalStorage("theme");
  const savedPreferences = getItem();
  const systemSetting = useMediaQuery("(prefers-color-scheme: dark)");
  const [authLoaded, setAuthLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
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
          MuiListItemButton: {},
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
  const [user, setUser] = useState(auth.currentUser);
  const handleUser: () => void = () => setUser(auth.currentUser);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider
        value={{ user, handleUser, selectedItems, setSelectedItems }}
      >
        <SnackbarProvider disableWindowBlurListener={true}>
          <CssBaseline />
          <Navbar mode={mode} toggleMode={toggleMode} setItem={setItem} />
          <Backdrop
            open={!authLoaded}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
          >
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="inherit" />
            </Container>
          </Backdrop>
          <Box component="main" mt={2}>
            <Box>
              <Outlet />
            </Box>
          </Box>
          <Dial mode={mode} toggleMode={toggleMode} setItem={setItem} />
        </SnackbarProvider>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
