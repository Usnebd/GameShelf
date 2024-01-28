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
import { auth, db } from "./components/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { SnackbarProvider } from "notistack";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import firebase from "firebase/compat/app";
interface SelectedItem {
  category: string;
  productName: string;
}

interface UserContextType {
  products: Record<string, DocumentData[]>;
  user: User | null;
  handleUser: () => void;
  selectedItems: SelectedItem[];
  setSelectedItems: (
    _: SelectedItem[] | ((prevItems: SelectedItem[]) => SelectedItem[])
  ) => void;
  findTotal: (_: SelectedItem[]) => void;
}

export const UserContext = createContext<UserContextType>({
  products: {
    Antipasti: [] as DocumentData[],
    Primi: [] as DocumentData[],
    Secondi: [] as DocumentData[],
    Dessert: [] as DocumentData[],
    Bevande: [] as DocumentData[],
  },
  user: auth.currentUser,
  handleUser: () => {},
  selectedItems: [] as SelectedItem[],
  setSelectedItems: (
    _: SelectedItem[] | ((prevItems: SelectedItem[]) => SelectedItem[])
  ) => {},
  findTotal: (_: SelectedItem[]) => {},
});

const categories: string[] = [
  "antipasti",
  "primi",
  "secondi",
  "dessert",
  "bevande",
];

function App() {
  const { setItem, getItem } = useLocalStorage("theme");
  const savedPreferences = getItem();
  const systemSetting = useMediaQuery("(prefers-color-scheme: dark)");
  const [authLoaded, setAuthLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [docs, setDocs] = useState<firebase.firestore.DocumentData[][]>([]);
  const [mode, setMode] = useState(
    savedPreferences != undefined ? savedPreferences : systemSetting
  );
  const products: Record<string, DocumentData[]> = {
    Antipasti: docs[0],
    Primi: docs[1],
    Secondi: docs[2],
    Dessert: docs[3],
    Bevande: docs[4],
  };
  const findTotal = (selectedItems: SelectedItem[]) => {
    return selectedItems
      .reduce((total, item) => {
        const product = products[item.category].find(
          (p) => p.nome === item.productName
        );
        const productPrice = product ? product.prezzo : 0;
        return total + productPrice;
      }, 0)
      .toFixed(2);
  };
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
    const fetchFirestoreData = async () => {
      try {
        const promises = categories.map(async (item) => {
          const querySnapshot = await getDocs(collection(db, item));
          return querySnapshot.docs.map((doc) => doc.data());
        });
        const data = await Promise.all(promises);
        setDocs(data);
      } catch (error) {
        console.error("Errore durante la lettura dei documenti:", error);
        // Gestisci l'errore in base alle tue esigenze
      }
    };

    // Chiamata alla funzione di fetch solo quando il componente viene montato
    if (authLoaded) {
      fetchFirestoreData();
    }
  }, [authLoaded]);
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
        value={{
          products,
          user,
          handleUser,
          selectedItems,
          setSelectedItems,
          findTotal,
        }}
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
