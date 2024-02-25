import { createContext, useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { Outlet, useLoaderData } from "react-router-dom";
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
  where,
  writeBatch,
} from "firebase/firestore";
import { Dayjs } from "dayjs";
interface SelectedItem {
  category: string;
  productName: string;
}

interface UserContextType {
  products: Record<string, DocumentData[]>;
  user: User | null;
  total: number;
  handleDeleteCart: () => void;
  docs: DocumentData[][];
  textNote: string;
  showTimerInput: boolean;
  setShowTimerInput: (_flag: boolean) => void;
  sendNotification: (_title: string, _message: string) => void;
  selectedTime: Dayjs | null;
  setSelectedTime: (_time: Dayjs | null) => void;
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
  docs: [],
  total: 0,
  selectedTime: null,
  showTimerInput: false,
  setShowTimerInput: () => {},
  setSelectedTime: () => {},
  handleDeleteCart: () => {},
  textNote: "",
  sendNotification: () => {},
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

export async function loader() {
  const promises = categories.map(async (item) => {
    const querySnapshot = await getDocs(collection(db, item));
    return querySnapshot.docs.map((doc) => doc.data());
  });
  const data = await Promise.all(promises);
  return data;
}

function App() {
  const { setItem, getItem } = useLocalStorage("theme");
  const savedPreferences = getItem();
  const systemSetting = useMediaQuery("(prefers-color-scheme: dark)");
  const [user, setUser] = useState(auth.currentUser);
  const [textNote, setTextNote] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [showTimerInput, setShowTimerInput] = useState(false);
  const [guestUser, setGuestUser] = useState(true);
  const docs: DocumentData[][] = useLoaderData() as DocumentData[][];
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
          MuiSpeedDialAction: {
            styleOverrides: {
              staticTooltipLabel: {
                color: mode ? "white" : "black",
                fontWeight: 600,
                fontSize: 20,
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
    setSelectedItems([]);
    setQuantitySelectedMap({});
    setTextNote("");
    setSelectedTime(null);
    setShowTimerInput(false);
    if (user) {
      try {
        const q = query(collection(db, `users/${user.email}/cart`));
        const querySnapshot = await getDocs(q);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setGuestUser(true);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const q = query(collection(db, `users/${user?.email}/cart`));
    if (guestUser && user) {
      selectedItems.map(async (item) => {
        const transactionGuest = writeBatch(db);
        try {
          const q = query(
            collection(db, `users/${user.email}/cart`),
            where("productName", "==", item.productName)
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.docs.length > 0) {
            const docRef = doc(
              db,
              `users/${user.email}/cart`,
              querySnapshot.docs[0].id
            );
            transactionGuest.update(docRef, {
              quantità: quantitySelectedMap[item.productName],
            });
          } else {
            let docRef = doc(
              db,
              `users/${user.email}/cart`,
              item.productName.substring(0, 19)
            );
            transactionGuest.set(docRef, {
              category: item.category,
              productName: item.productName,
              quantità: quantitySelectedMap[item.productName],
            });
          }
          await transactionGuest.commit();
        } catch (error) {
          console.log(error);
        }
      });
      setGuestUser(false);
    }
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      setSelectedItems([]);
      data.map((item: DocumentData) => {
        const selectedItem: SelectedItem = {
          category: item.category,
          productName: item.productName,
        };
        setSelectedItems((prevSelectedItems: SelectedItem[]) => {
          if (
            prevSelectedItems.find((x) => x.productName == item.product) ==
            undefined
          ) {
            return [...prevSelectedItems, selectedItem];
          }
          return prevSelectedItems;
        });
        setQuantitySelectedMap((prevMap) => {
          if (prevMap[selectedItem.productName]) {
            return prevMap;
          } else {
            return { ...prevMap, [selectedItem.productName]: item.quantità };
          }
        });
      });
    });

    return () => unsubscribe();
  }, [user]);

  const sendNotification = (title: string, message: string) => {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        lang: "en",
        body: message,
        icon: "/assets/pwa-192x192.png",
        vibrate: [200, 100, 200], //200ms pausa, 200ms,
      });
    });
  };

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
          sendNotification,
          selectedTime,
          showTimerInput,
          setShowTimerInput,
          setSelectedTime,
          handleDeleteCart,
          docs,
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
        <SnackbarProvider
          disableWindowBlurListener={true}
          autoHideDuration={3300}
        >
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
