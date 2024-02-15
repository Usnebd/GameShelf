import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import NotesIcon from "@mui/icons-material/Notes";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import {
  DocumentData,
  WithFieldValue,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { purple } from "@mui/material/colors";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";

function Checkout() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [showNoteInput, setShowNoteInput] = useState(false);
  const {
    selectedItems,
    setSelectedItems,
    products,
    quantitySelectedMap,
    setQuantitySelectedMap,
    total,
    user,
    textNote,
    setTextNote,
    handleDeleteCart,
    selectedTime,
    setSelectedTime,
    showTimerInput,
    setShowTimerInput,
  } = useContext(UserContext);

  const handleNote = () => {
    setShowTimerInput(false);
    setShowNoteInput((prev) => !prev);
  };
  const handleTimer = () => {
    if (selectedTime) {
      setSelectedTime(null);
    } else {
      setShowNoteInput(false);
      setShowTimerInput(!showTimerInput);
    }
  };

  const handleOrder = async () => {
    if (!user) {
      enqueueSnackbar("Not Logged", { variant: "error" });
    } else if (
      auth?.currentUser?.providerData.some(
        (provider) => provider?.providerId === "password"
      )
    ) {
      if (auth?.currentUser?.emailVerified) {
        const ordersCollectionRef = collection(
          db,
          `users/${user.email}/orders`
        );
        let order: WithFieldValue<DocumentData>;
        const timestamp = new Date();
        if (selectedTime) {
          order = {
            prodotti: selectedItems.map((item) => ({
              nome: item.productName,
              quantità: quantitySelectedMap[item.productName],
            })),
            delivery: {
              hour: selectedTime?.hour(),
              minute: selectedTime?.minute(),
            },
            nota: textNote,
            timestamp: timestamp,
            totale: Number(total.toFixed(2)),
          };
          try {
            addDoc(ordersCollectionRef, order);
            enqueueSnackbar("Order Sent", { variant: "success" });
            if (!("Notification" in window)) {
              alert("This browser does not support desktop notification");
            } else if (Notification.permission === "granted") {
              navigator.serviceWorker.controller?.postMessage({
                hour: selectedTime?.hour(),
                minute: selectedTime?.minute(),
                order: order,
                nota: textNote,
              });
              enqueueSnackbar("Timer Setted", { variant: "info" });
            } else if (Notification.permission !== "denied") {
              navigator.serviceWorker.controller?.postMessage({
                hour: selectedTime?.hour(),
                minute: selectedTime?.minute(),
                order: order,
                nota: textNote,
              });
              Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                  enqueueSnackbar("Timer Setted", { variant: "info" });
                }
              });
            } else {
              // Gli utenti hanno già negato i permessi
              enqueueSnackbar("Notifications are blocked", {
                variant: "error",
              });
            }
            handleDeleteCart();
          } catch (error) {
            enqueueSnackbar("Error", { variant: "error" });
          }
        } else {
          order = {
            prodotti: selectedItems.map((item) => ({
              nome: item.productName,
              quantità: quantitySelectedMap[item.productName],
            })),
            nota: textNote,
            timestamp: timestamp,
            totale: Number(total.toFixed(2)),
          };
          try {
            addDoc(ordersCollectionRef, order);
            enqueueSnackbar("Order Sent", { variant: "success" });
            handleDeleteCart();
          } catch (error) {
            enqueueSnackbar("Error", { variant: "error" });
          }
        }
      } else {
        enqueueSnackbar("Verify Email & Refresh page", { variant: "warning" });
      }
    } else {
      const ordersCollectionRef = collection(db, `users/${user.email}/orders`);
      let order: WithFieldValue<DocumentData>;
      const timestamp = new Date();
      if (selectedTime) {
        order = {
          prodotti: selectedItems.map((item) => ({
            nome: item.productName,
            quantità: quantitySelectedMap[item.productName],
          })),
          delivery: {
            hour: selectedTime?.hour(),
            minute: selectedTime?.minute(),
          },
          nota: textNote,
          timestamp: timestamp,
          totale: Number(total.toFixed(2)),
        };
        try {
          addDoc(ordersCollectionRef, order);
          enqueueSnackbar("Order Sent", { variant: "success" });
          if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
          } else if (Notification.permission === "granted") {
            navigator.serviceWorker.controller?.postMessage({
              hour: selectedTime?.hour(),
              minute: selectedTime?.minute(),
              order: order,
              nota: textNote,
            });
            enqueueSnackbar("Timer Setted", { variant: "info" });
          } else if (Notification.permission !== "denied") {
            // Richiedi i permessi solo se non sono stati negati
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                navigator.serviceWorker.controller?.postMessage({
                  hour: selectedTime?.hour(),
                  minute: selectedTime?.minute(),
                  order: order,
                  nota: textNote,
                });
                enqueueSnackbar("Timer Setted", { variant: "success" });
              }
            });
          } else {
            // Gli utenti hanno già negato i permessi
            enqueueSnackbar("Notifications are blocked", {
              variant: "error",
            });
          }
          handleDeleteCart();
        } catch (error) {
          enqueueSnackbar("Error", { variant: "error" });
        }
      } else {
        order = {
          prodotti: selectedItems.map((item) => ({
            nome: item.productName,
            quantità: quantitySelectedMap[item.productName],
          })),
          nota: textNote,
          timestamp: timestamp,
          totale: Number(total.toFixed(2)),
        };
        try {
          addDoc(ordersCollectionRef, order);
          enqueueSnackbar("Order Sent", { variant: "success" });
          handleDeleteCart();
        } catch (error) {
          enqueueSnackbar("Error", { variant: "error" });
        }
      }
    }
  };

  const handleRemoveItem = async (productName: string) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.productName !== productName)
    );
    setQuantitySelectedMap((prevMap) => ({
      ...prevMap,
      [productName]: 0,
    }));
    if (user) {
      try {
        const q = query(
          collection(db, `users/${user.email}/cart`),
          where("productName", "==", productName)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach((docSnapshot) => {
          const docRef = doc(db, `users/${user.email}/cart`, docSnapshot.id);
          deleteDoc(docRef);
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const PurpleButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));

  return (
    <Box
      mx={isSmScreen ? 4 : 2}
      mb={3}
      textAlign={isSmScreen ? "start" : "center"}
    >
      <Stack
        mt={3}
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h3" sx={{ display: { xs: "none", sm: "block" } }}>
          Checkout
        </Typography>
        <Box
          display={"flex"}
          flexDirection={"row"}
          sx={{ userSelect: "none", alignItems: "center" }}
          justifyContent={"center"}
        >
          <ShoppingCartIcon fontSize={"large"} />
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            sx={{
              textTransform: "none",
            }}
          >
            {"Total: " + total.toFixed(2) + "€"}
          </Typography>
        </Box>
      </Stack>
      <Stack
        direction={isSmScreen ? "row" : "column"}
        spacing={3}
        mt={isSmScreen ? 10 : 3}
      >
        <Stack direction={"column"} spacing={2} px={isSmScreen ? 1 : 5}>
          <Button
            sx={{ py: 1 }}
            variant="contained"
            aria-label={
              selectedItems.length == 0 ? "Create Order" : "Modify Order"
            }
            color={"info"}
            onClick={() => {
              setShowTimerInput(false);
              setShowNoteInput(false);
              navigate("/");
            }}
          >
            <Typography variant="h6" fontWeight={"bold"} flexGrow={1}>
              {selectedItems.length == 0 ? "Create Order" : "Modify Order"}
            </Typography>
            <EditIcon fontSize="large" />
          </Button>
          <Button
            variant="contained"
            color={"warning"}
            aria-label="Add a note"
            sx={{ py: 1 }}
            onClick={handleNote}
          >
            <Typography variant="h6" fontWeight={"bold"} flexGrow={1}>
              {textNote == "" ? "Add note" : "Modify Note"}
            </Typography>
            {showNoteInput ? (
              <DoneIcon fontSize="large" />
            ) : (
              <NotesIcon fontSize="large" />
            )}
          </Button>
          <PurpleButton
            variant="contained"
            color="primary"
            aria-label="SetDelivery"
            sx={{ py: 1 }}
            onClick={handleTimer}
          >
            <Typography variant="h6" fontWeight="bold" flexGrow={1}>
              {selectedTime
                ? `${selectedTime
                    .hour()
                    .toString()
                    .padStart(2, "0")}:${selectedTime
                    .minute()
                    .toString()
                    .padStart(2, "0")}`
                : "Set Timer"}
            </Typography>
            {selectedTime ? (
              <DeleteIcon fontSize="large" />
            ) : showTimerInput ? (
              <DoneIcon fontSize="large" />
            ) : (
              <AccessAlarmsIcon fontSize="large" />
            )}
          </PurpleButton>
          <Button
            variant="contained"
            color={"success"}
            aria-label="Place Order"
            sx={{ py: 1 }}
            disabled={
              selectedItems.length == 0 || showNoteInput || showTimerInput
            }
            onClick={handleOrder}
          >
            <Typography variant="h6" fontWeight={"bold"} flexGrow={1}>
              Place Order
            </Typography>
            <SendIcon fontSize="large" />
          </Button>
          <Button
            variant="contained"
            color={"error"}
            aria-label="Delete Order"
            sx={{ py: 1 }}
            onClick={handleDeleteCart}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Delete
            </Typography>
            <DeleteIcon fontSize="large" />
          </Button>
        </Stack>
        <Box
          display={"flex"}
          flexDirection={"row"}
          sx={{
            userSelect: "none",
            alignItems: "center",
            display: { xs: "flex", sm: "none" },
          }}
          justifyContent={"center"}
        >
          <ShoppingCartIcon fontSize={"large"} />
          <Typography
            variant="h4"
            display="flex"
            alignItems="center"
            sx={{
              textTransform: "none",
            }}
          >
            {"Total: " + total.toFixed(2) + "€"}
          </Typography>
        </Box>
        <Box mx={isSmScreen ? 0 : 5} flexGrow={1}>
          {showNoteInput || showTimerInput ? (
            showNoteInput ? (
              <Box display="flex" justifyContent="center">
                <TextField
                  id="note"
                  label="Add a note for your order..."
                  multiline
                  rows={6}
                  autoFocus
                  sx={{
                    width: isSmScreen ? "90%" : "100%",
                    borderRadius: 1,
                  }}
                  value={textNote}
                  inputProps={{ style: { fontSize: 23 } }}
                  onChange={(event) => setTextNote(event.target.value)}
                />
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  borderRadius: 2,
                }}
              >
                {dayjs().isAfter(dayjs().hour(23).minute(59)) ? (
                  <Stack
                    spacing={2}
                    mt={5}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Typography variant="h4" justifyContent={"center"}>
                      Chiosco is Closed!
                    </Typography>
                    <Typography variant="h4" justifyContent={"center"}>
                      Open time at 8:00
                    </Typography>
                  </Stack>
                ) : (
                  <Paper
                    sx={{ width: "100%" }}
                    elevation={theme.palette.mode == "dark" ? 4 : 14}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DigitalClock
                        timeStep={5}
                        skipDisabled
                        minTime={
                          dayjs().isBefore(dayjs().hour(8).minute(0))
                            ? dayjs("08:00")
                            : dayjs()
                        }
                        maxTime={dayjs().hour(23).minute(59)}
                        ampm={false}
                        value={selectedTime || null}
                        onChange={(newValue) => {
                          setSelectedTime(newValue);
                          setShowTimerInput(false);
                        }}
                        sx={{
                          scrolBehavior: "smooth",
                          scrollbarColor:
                            theme.palette.mode == "dark"
                              ? `#777 #121212`
                              : `#777 #fff`,
                        }}
                      />
                    </LocalizationProvider>
                  </Paper>
                )}
              </Box>
            )
          ) : selectedItems.length == 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <Typography variant="h3">Empty Cart</Typography>
              <RemoveShoppingCartIcon fontSize="large" sx={{ mt: 2 }} />
            </Box>
          ) : isMdScreen ? (
            <TableContainer
              component={Paper}
              elevation={10}
              sx={{ borderRadius: 2.5 }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Product</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5">Category</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5">Quantity</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h5">Price</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow
                      key={item.productName}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell align="left" sx={{ padding: 0 }}>
                        <Tooltip title="Remove">
                          <IconButton
                            aria-label="remove"
                            size="large"
                            sx={{ ml: 2 }}
                            onClick={() => {
                              handleRemoveItem(item.productName);
                            }}
                          >
                            <RemoveCircleOutlineIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Typography variant="h6">{item.productName}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">{item.category}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">
                          {quantitySelectedMap[item.productName]}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6">
                          {(
                            quantitySelectedMap[item.productName] *
                            products[item.category].find(
                              (prod) => prod["nome"] === item.productName
                            )?.prezzo
                          ).toFixed(2) + " €"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <List>
              {selectedItems.map((item) => (
                <ListItem disableGutters key={item.productName}>
                  <Paper
                    sx={{
                      borderRadius: 4,
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      py: 1, // Padding verticale
                    }}
                  >
                    <IconButton
                      aria-label="remove"
                      size="large"
                      onClick={() => {
                        handleRemoveItem(item.productName);
                      }}
                    >
                      <RemoveCircleOutlineIcon color="error" fontSize="large" />
                    </IconButton>
                    <Typography
                      variant="h5"
                      sx={{ textAlign: "center" }}
                      alignItems={"center"}
                    >
                      {quantitySelectedMap[item.productName]}x{" "}
                      {item.productName}
                    </Typography>
                  </Paper>
                </ListItem>
              ))}
            </List>
          )}
          {!showNoteInput && textNote !== "" ? (
            <Paper
              elevation={10}
              sx={{
                borderRadius: 2.5,
                mt: 5,
                maxWidth: "700px",
                mx: "auto", // Aggiunto per centrare orizzontalmente
                bgcolor: "orange",
              }}
            >
              <Box py={3} px={4}>
                <Typography variant="h4" fontWeight={"bold"} color="black">
                  Note
                </Typography>
                <Typography
                  variant="h6"
                  pt={2.5}
                  fontWeight={"bold"}
                  sx={{ wordBreak: "break-word" }}
                  color="black"
                >
                  {textNote}
                </Typography>
              </Box>
            </Paper>
          ) : (
            <></>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default Checkout;
