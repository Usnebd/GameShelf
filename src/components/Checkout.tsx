import {
  Box,
  Button,
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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function Checkout() {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [showNoteInput, setShowNoteInput] = useState(false);
  const {
    selectedItems,
    products,
    quantitySelectedMap,
    setQuantitySelectedMap,
    total,
    user,
    textNote,
    setTextNote,
    setSelectedItems,
    handleDeleteCart,
  } = useContext(UserContext);

  const handleNote = () => {
    setShowNoteInput((prev) => !prev);
  };

  const handleOrder = async () => {
    if (!user) {
      enqueueSnackbar("Not Logged", { variant: "error" });
    } else {
      const ordersCollectionRef = collection(db, `users/${user.email}/orders`);

      // Il documento che vuoi aggiungere
      let order;
      if (textNote !== "") {
        order = {
          prodotti: selectedItems.map((item) => ({
            nome: item.productName,
            quantità: quantitySelectedMap[item.productName],
          })),
          nota: textNote,
          timestamp: serverTimestamp(),
          totale: Number(total.toFixed(2)),
        };
      } else {
        order = {
          prodotti: selectedItems.map((item) => ({
            nome: item.productName,
            quantità: quantitySelectedMap[item.productName],
          })),
          timestamp: serverTimestamp(),
          totale: Number(total.toFixed(2)),
        };
      }

      // Aggiungi il documento utilizzando addDoc
      try {
        addDoc(ordersCollectionRef, order);
        enqueueSnackbar("Order Sent", { variant: "success" });
        setSelectedItems([]);
        setQuantitySelectedMap({});
        setTextNote("");
        handleDeleteCart();
      } catch (error) {
        enqueueSnackbar("Error", { variant: "error" });
      }
    }
  };

  return (
    <Box
      mx={isSmScreen ? 5 : 0}
      mb={5}
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
      </Stack>
      <Stack
        direction={isSmScreen ? "row" : "column"}
        spacing={8}
        mt={isSmScreen ? 10 : 0}
        mx={isSmScreen ? 0 : 5}
      >
        <Stack
          direction={"column"}
          spacing={isSmScreen ? 3 : 2}
          mt={isSmScreen ? 0 : 5}
        >
          <Button
            sx={{ py: 1 }}
            variant="contained"
            aria-label={
              selectedItems.length == 0 ? "Create Order" : "Modify Order"
            }
            color={"warning"}
            onClick={() => navigate("/")}
            disabled={showNoteInput}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              {selectedItems.length == 0 ? "Create Order" : "Modify Order"}
            </Typography>
            <EditIcon fontSize="large" />
          </Button>
          <Button
            variant="contained"
            color={showNoteInput ? "success" : "info"}
            aria-label="Add a note"
            sx={{ py: 1 }}
            onClick={handleNote}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Add note
            </Typography>
            {showNoteInput ? (
              <DoneIcon fontSize="large" />
            ) : (
              <NotesIcon fontSize="large" />
            )}
          </Button>
          <Button
            variant="contained"
            color={"success"}
            aria-label="Place Order"
            sx={{ py: 1 }}
            disabled={selectedItems.length == 0 || showNoteInput ? true : false}
            onClick={handleOrder}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Place Order
            </Typography>
            <SendIcon fontSize="large" />
          </Button>
          <Button
            variant="contained"
            color={"error"}
            aria-label="Delete Order"
            sx={{ py: 1 }}
            disabled={selectedItems.length == 0 || showNoteInput ? true : false}
            onClick={handleDeleteCart}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Delete
            </Typography>
            <DeleteIcon fontSize="large" />
          </Button>
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
        <Box mx={isSmScreen ? 0 : 5} flexGrow={1}>
          {showNoteInput ? (
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
          ) : selectedItems.length == 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
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
            <Box>
              <List>
                {selectedItems.map((item) => (
                  <ListItem
                    disablePadding
                    key={item.productName}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderBottom: "1px solid #ddd", // Aggiunge una linea divisoria tra gli elementi
                      py: 2, // Padding verticale
                    }}
                  >
                    <Typography variant="h5">
                      {quantitySelectedMap[item.productName]}x{" "}
                      {item.productName}
                    </Typography>
                    <Typography variant="h6">
                      {(
                        quantitySelectedMap[item.productName] *
                        products[item.category].find(
                          (prod) => prod["nome"] === item.productName
                        )?.prezzo
                      ).toFixed(2) + "€"}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {!showNoteInput && textNote !== "" ? (
            <Paper
              elevation={10}
              sx={{
                borderRadius: 2.5,
                mt: 5,
                maxWidth: "700px",
                mx: "auto", // Aggiunto per centrare orizzontalmente
              }}
            >
              <Box py={3} px={4}>
                <Typography
                  variant="h4"
                  fontWeight={"bold"}
                  color={theme.palette.mode == "dark" ? "secondary" : "primary"}
                >
                  Note
                </Typography>
                <Typography
                  variant="h6"
                  pt={2.5}
                  fontWeight={"bold"}
                  sx={{ wordBreak: "break-word" }}
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
