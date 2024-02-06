import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
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
import { UserContext } from "../App";
import {
  DocumentData,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

function Orders() {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const isLgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [orders, setOrders] = useState<DocumentData[]>([]);
  const [ascending, setAscending] = useState(true);
  const [retrievedData, setRetrievedData] = useState(false);
  const [max, setMax] = useState(0);
  const [filteredPrice, setFilteredPrice] = useState([0, 0]); // Valori di default per lo slider
  const { user } = useContext(UserContext);

  const handleSort = () => {
    setAscending((prev) => !prev);
    setOrders((prev) => [...prev].reverse());
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setFilteredPrice(newValue as number[]);
  };

  useEffect(() => {
    const fetchFirestoreData = async () => {
      if (user !== null) {
        const q = query(
          collection(db, `users/${user.email}/orders`),
          orderBy("timestamp", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => doc.data());
          setOrders(data);
          setRetrievedData(true);
          const maxTotal = Math.max(...data.map((order) => order.totale));
          setMax(maxTotal > 0 ? maxTotal : 0);
          setFilteredPrice([0, maxTotal]);
        });

        return () => unsubscribe();
      }
    };

    fetchFirestoreData();
  }, [user]);

  return (
    <Box
      mx={isSmScreen ? 5 : 0}
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
      <Stack
        direction={isSmScreen ? "row" : "column"}
        spacing={7}
        mt={5}
        mx={isSmScreen ? 0 : 5}
      >
        <Stack direction={"column"} spacing={3} mb={12} mt={isSmScreen ? 0 : 5}>
          <Button
            variant={theme.palette.mode == "dark" ? "outlined" : "contained"}
            sx={{ py: 1.3, minWidth: "190px" }}
            color={theme.palette.mode == "dark" ? "secondary" : "primary"}
            onClick={handleSort}
          >
            <Typography>
              {ascending ? "Sort Ascending" : "Sort Descending"}
            </Typography>
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
        </Stack>
        <Box flexGrow={1} display="flex" justifyContent={"center"}>
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
                .filter((order) => order.totale <= filteredPrice[1])
                .map((order) => (
                  <ListItem
                    key={order.timestamp}
                    sx={{ justifyContent: "center" }}
                    disableGutters
                  >
                    <Accordion
                      elevation={6}
                      sx={{
                        width: isLgScreen ? "80%" : "100%",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          width="100%"
                        >
                          <Typography variant="h5">
                            Total: {order.totale.toFixed(2)}€
                          </Typography>
                          <Typography variant="h6">
                            {new Date(
                              order.timestamp.seconds * 1000
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
                        <Box width="100%">
                          {order.prodotti.map(
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
                          {order.nota && (
                            <>
                              <Divider sx={{ mt: 2, mb: 1 }} />
                              <Typography variant="h6">
                                Note: {order.nota}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
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
