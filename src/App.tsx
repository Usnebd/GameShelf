import { createContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { useLocalStorage } from "./custom_hook/useLocalStorage";
import Dial from "./components/Dial";
import { auth, db } from "./components/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { SnackbarProvider } from "notistack";
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  writeBatch,
} from "firebase/firestore";
interface SelectedItem {
  category: string;
  productName: string;
}

interface UserContextType {
  products: Record<string, DocumentData[]>;
  user: User | null;
  productsLoaded: boolean;
  total: number;
  authLoaded: boolean;
  handleDeleteCart: () => void;
  docs: DocumentData[][];
  textNote: string;
  setTextNote: (_text: string) => void;
  setTotal: (_tot: number) => void;
  selectedItems: SelectedItem[];
  setSelectedItems: (
    _: SelectedItem[] | ((prevItems: SelectedItem[]) => SelectedItem[])
  ) => void;
  quantitySelectedMap: Record<string, number>;
  setQuantitySelectedMap: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}

export const UserContext = createContext<UserContextType>({
  products: {
    Antipasti: [] as DocumentData[],
    Primi: [] as DocumentData[],
    Secondi: [] as DocumentData[],
    Desserts: [] as DocumentData[],
    Bevande: [] as DocumentData[],
  },
  user: auth.currentUser,
  productsLoaded: false,
  docs: [],
  authLoaded: false,
  total: 0,
  handleDeleteCart: () => {},
  textNote: "",
  setTextNote: () => {},
  setTotal: () => {},
  selectedItems: [] as SelectedItem[],
  setSelectedItems: (
    _: SelectedItem[] | ((prevItems: SelectedItem[]) => SelectedItem[])
  ) => {},
  quantitySelectedMap: {} as Record<string, number>,
  setQuantitySelectedMap: (
    _:
      | React.SetStateAction<Record<string, number>>
      | ((prevMap: Record<string, number>) => Record<string, number>)
  ) => {},
});

const categories: string[] = [
  "antipasti",
  "primi",
  "secondi",
  "desserts",
  "bevande",
];

function App() {
  const { setItem, getItem } = useLocalStorage("theme");
  const savedPreferences = getItem();
  const systemSetting = useMediaQuery("(prefers-color-scheme: dark)");
  const [authLoaded, setAuthLoaded] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [textNote, setTextNote] = useState<string>("");
  const [docs, setDocs] = useState<DocumentData[][]>([]);
  const [total, setTotal] = useState(0);
  const [mode, setMode] = useState(
    savedPreferences != undefined ? savedPreferences : systemSetting
  );
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [quantitySelectedMap, setQuantitySelectedMap] = useState<
    Record<string, number>
  >({});

  const products: Record<string, DocumentData[]> = {
    Antipasti: docs[0],
    Primi: docs[1],
    Secondi: docs[2],
    Desserts: docs[3],
    Bevande: docs[4],
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
          MuiAccordion: {
            styleOverrides: {},
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

  const handleDeleteCart = async () => {
    if (user !== null) {
      try {
        const q = query(collection(db, `users/${user.email}/cart`));
        const querySnapshot = await getDocs(q);
        setSelectedItems([]);
        setQuantitySelectedMap({});
        // Get a new write batch
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((docSnapshot) => {
          const docRef = doc(db, `users/${user.email}/cart`, docSnapshot.id);
          batch.delete(docRef);
        });
        // Commit the batch
        await batch.commit();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const promises = categories.map(async (item) => {
          const querySnapshot = await getDocs(collection(db, item));
          return querySnapshot.docs.map((doc) => doc.data());
        });
        const data = await Promise.all(promises);
        setDocs(data);
        setProductsLoaded(true);
      } catch (error) {
        console.error("Errore durante la lettura dei documenti:", error);
      }
    };

    fetchProductsData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoaded(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, `users/${user?.email}/cart`));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setSelectedItems([]);
      data.map((item: DocumentData) => {
        const selectedItem: SelectedItem = {
          category: item.category,
          productName: item.productName,
        };
        setSelectedItems((prevSelectedItems: SelectedItem[]) => {
          return [...prevSelectedItems, selectedItem];
        });
        setQuantitySelectedMap((prevMap) => ({
          ...prevMap,
          [selectedItem.productName]: item.quantità,
        }));
      });
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const findTotal = (
      selectedItems: SelectedItem[],
      quantitySelectedMap: Record<string, number>
    ) => {
      return selectedItems.reduce((total, item) => {
        const product = products[item.category].find(
          (p) => p.nome === item.productName
        );
        const productPrice = product ? product.prezzo : 0;
        return total + productPrice * quantitySelectedMap[product?.nome];
      }, 0);
    };
    setTotal(findTotal(selectedItems, quantitySelectedMap));
  }, [selectedItems, quantitySelectedMap]);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider
        value={{
          handleDeleteCart,
          docs,
          authLoaded,
          productsLoaded,
          textNote,
          setTextNote,
          total,
          setTotal,
          products,
          user,
          selectedItems,
          setSelectedItems,
          quantitySelectedMap,
          setQuantitySelectedMap,
        }}
      >
        <SnackbarProvider disableWindowBlurListener={true}>
          <CssBaseline />
          <Navbar mode={mode} toggleMode={toggleMode} setItem={setItem} />
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
