import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonBase,
  Divider,
  List,
  ListItem,
  Slider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserContext } from "../App";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { useSearchParams } from "react-router-dom";

function Orders() {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isLgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<QueryDocumentSnapshot[]>([]);
  const [max, setMax] = useState(0);
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort_by") == "asc(date)" ? true : false
  );
  const [retrievedData, setRetrievedData] = useState(false);
  const [filteredPrice, setFilteredPrice] = useState([
    parseInt(searchParams.get("offset") || "0", 10),
    parseInt(searchParams.get("limit") || "0", 10),
  ]); // Valori di default per lo slider
  const { user } = useContext(UserContext);

  const handleSort = () => {
    const sortByValue = sortOrder ? "asc(date)" : "desc(date)";
    const params = new URLSearchParams(searchParams);
    params.set("sort_by", encodeURIComponent(sortByValue));
    setSearchParams(params.toString());
    setSortOrder((prev) => !prev);
    setOrders((prev) => [...prev].reverse());
  };

  const handleDelete = async () => {
    if (user && orders.length > 0) {
      try {
        const q = query(collection(db, `users/${user.email}/orders`));
        const querySnapshot = await getDocs(q);
        // Get a new write batch
        const batch = writeBatch(db);
        querySnapshot.docs.forEach((docSnapshot) => {
          const docRef = doc(db, `users/${user.email}/orders`, docSnapshot.id);
          batch.delete(docRef);
        });
        // Commit the batch
        await batch.commit();
        enqueueSnackbar("Order History Deleted", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      }
    }
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const params = new URLSearchParams(searchParams);
    if (Array.isArray(newValue)) {
      setFilteredPrice(newValue);
      params.set("offset", newValue[0].toString());
      params.set("limit", newValue[1].toString());
    } else {
      const newOffset = newValue;
      setFilteredPrice([newOffset, filteredPrice[1]]);
      params.set("offset", newOffset.toString());
    }
    setSearchParams(params.toString());
  };

  const handleDeleteItem = async (
    order: QueryDocumentSnapshot<DocumentData, DocumentData>
  ) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.email}/orders`, order.id));
        enqueueSnackbar("Order Deleted", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchFirestoreData = async () => {
      if (user !== null) {
        const q = query(
          collection(db, `users/${user.email}/orders`),
          orderBy("timestamp", "desc")
        );

        onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          if (data.length > 0) {
            setOrders(querySnapshot.docs);
            setRetrievedData(true);
            // Calcolo del massimo totale degli ordini
            const maxTotal = Math.max(
              ...data.map((order) => Math.round(order.totale * 100))
            );
            setMax(maxTotal / 100); // Arrotonda e imposta il massimo totale
            setFilteredPrice([
              parseInt(searchParams.get("offset") || "0", 10),
              parseInt(
                searchParams.get("limit") || maxTotal.toString() || "0",
                10
              ),
            ]);
          } else {
            setFilteredPrice([0, 0]);
          }
        });
      }
    };

    fetchFirestoreData();
  }, [user]);

  return (
    <Box
      ml={isSmScreen ? 5 : 0}
      mr={isSmScreen ? 2 : 0}
      mb={5}
      textAlign={isSmScreen ? "start" : "center"}
    >
      <Typography
        variant="h3"
        mt={3}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        Orders
      </Typography>
      <Stack direction={isSmScreen ? "row" : "column"} spacing={5} mt={5}>
        <Stack
          direction={"column"}
          spacing={3}
          mb={12}
          mt={isSmScreen ? 0 : 5}
          px={isSmScreen ? 0 : 8}
        >
          <Button
            variant={theme.palette.mode == "dark" ? "outlined" : "contained"}
            sx={{ py: 1.3, minWidth: "210px" }}
            color={theme.palette.mode == "dark" ? "secondary" : "primary"}
            onClick={handleSort}
          >
            <Typography fontWeight={"bold"} flexGrow={1}>
              Sort Date
            </Typography>
            <SwapVertIcon fontSize="large" />
          </Button>
          <Typography variant="h6" display="flex" justifyContent={"center"}>
            Price Filter:
          </Typography>
          <Slider
            value={filteredPrice}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={0}
            max={max}
            step={1}
          />
          <Button
            onClick={handleDelete}
            disabled={!user}
            variant={theme.palette.mode == "dark" ? "outlined" : "contained"}
            sx={{ py: 1.3, minWidth: "210px" }}
            color="error"
          >
            <Typography fontWeight={"bold"} flexGrow={1}>
              Delete
            </Typography>
            <DeleteIcon fontSize="large" />
          </Button>
        </Stack>
        <Box
          flexGrow={1}
          display="flex"
          justifyContent={"center"}
          px={isSmScreen ? 0 : 1.5}
        >
          {!user ? (
            <Box>
              <Typography variant="h4">Please, Sign In !</Typography>
            </Box>
          ) : orders.length == 0 && retrievedData ? (
            <Box display={"flex"} justifyContent={"center"}>
              <Typography variant="h4">No orders Found !</Typography>
            </Box>
          ) : (
            <List sx={{ width: "100%" }}>
              {orders
                .filter(
                  (order) =>
                    order.data().totale <= filteredPrice[1] &&
                    order.data().totale >= filteredPrice[0]
                )
                .map((order) => (
                  <ListItem
                    key={order.data().timestamp}
                    sx={{ justifyContent: "center" }}
                    disableGutters
                  >
                    <Accordion
                      elevation={10}
                      sx={{
                        width: isLgScreen ? "80%" : "100%",
                        bgcolor: order.metadata.hasPendingWrites
                          ? "warning.main"
                          : "inherit",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ExpandMoreIcon
                            sx={{
                              color: order.metadata.hasPendingWrites
                                ? "black"
                                : "inherit",
                            }}
                          />
                        }
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                          color={
                            order.metadata.hasPendingWrites
                              ? "black"
                              : "inherit"
                          }
                        >
                          <Typography variant="h5">
                            Total: {order.data().totale.toFixed(2)}€
                          </Typography>
                          <Typography variant="h6">
                            {new Date(
                              order.data().timestamp.seconds * 1000
                            ).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              second: "numeric",
                            })}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          width="100%"
                          color={
                            order.metadata.hasPendingWrites
                              ? "black"
                              : "inherit"
                          }
                        >
                          {order
                            .data()
                            .prodotti.map(
                              (prodotto: {
                                id: number;
                                nome: string;
                                quantità: number;
                              }) => (
                                <Box
                                  key={prodotto.nome}
                                  display="flex"
                                  justifyContent="space-between"
                                >
                                  <Typography>• {prodotto.nome}</Typography>
                                  <Box display={"flex"} flexDirection={"row"}>
                                    <Typography>
                                      Quantity: {prodotto.quantità}
                                    </Typography>
                                  </Box>
                                </Box>
                              )
                            )}
                          {order.data().nota && (
                            <>
                              <Divider sx={{ mt: 2, mb: 1 }} />
                              <Typography variant="h6">
                                Note: {order.data().nota}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                      {order.metadata.hasPendingWrites && (
                        <Box textAlign="center" py={1}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color={"black"}
                          >
                            Pending
                          </Typography>
                        </Box>
                      )}
                      <Box
                        textAlign="center"
                        display="flex"
                        justifyContent={"center"}
                        py={1}
                        flexDirection={"row"}
                        bgcolor="red"
                      >
                        <ButtonBase
                          sx={{ width: "100%" }}
                          onClick={() => handleDeleteItem(order)}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Delete
                          </Typography>
                          <DeleteIcon fontSize="large" />
                        </ButtonBase>
                      </Box>
                    </Accordion>
                  </ListItem>
                ))}
            </List>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default Orders;
