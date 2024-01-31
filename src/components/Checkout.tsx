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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useContext } from "react";
import { UserContext } from "../App";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

function Checkout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { selectedItems, products, quantitySelectedMap, total } =
    useContext(UserContext);

  return (
    <Box
      mx={isSmScreen ? 5 : 0}
      mb={5}
      textAlign={isSmScreen ? "start" : "center"}
    >
      <Stack
        mt={4}
        direction={"row"}
        justifyContent="space-between"
        alignItems="center"
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h3" sx={{ display: { xs: "none", sm: "block" } }}>
          Your order
        </Typography>
      </Stack>
      <Stack
        direction={isSmScreen ? "row" : "column"}
        mt={isSmScreen ? 13 : 0}
        mx={isSmScreen ? 0 : 5}
      >
        <Stack
          direction={"column"}
          spacing={3}
          mr={isSmScreen ? 6 : 0}
          mb={12}
          mt={isSmScreen ? 0 : 5}
        >
          <Button
            sx={{ py: 1 }}
            variant="contained"
            aria-label="Modify Order"
            color={theme.palette.mode == "dark" ? "secondary" : "primary"}
            onClick={() => navigate("/")}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Modify Order
            </Typography>
            <EditIcon fontSize="large" />
          </Button>
          <Button
            variant="contained"
            color={"success"}
            aria-label="Place Order"
            sx={{ py: 1 }}
            disabled={selectedItems.length == 0 ? true : false}
          >
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Place Order
            </Typography>
            <SendIcon fontSize="large" />
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
        <Box flexGrow={1} mx={isSmScreen ? 0 : 5}>
          {selectedItems.length == 0 ? (
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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow
                      key={item.productName}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {item.productName}
                      </TableCell>
                      <TableCell align="right">{item.category}</TableCell>
                      <TableCell align="right">
                        {quantitySelectedMap[item.productName]}
                      </TableCell>
                      <TableCell align="right">
                        {(
                          quantitySelectedMap[item.productName] *
                          products[item.category].find(
                            (prod) => prod["nome"] === item.productName
                          )?.prezzo
                        ).toFixed(2) + "€"}
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
                    key={item.productName} // Muovi la chiave qui
                    sx={{ justifyContent: "center" }}
                  >
                    <Typography variant="h5">
                      {quantitySelectedMap[item.productName]}x{" "}
                      {item.productName}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

export default Checkout;
