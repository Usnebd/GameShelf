import { useContext, useState } from "react";
import {
  Box,
  Typography,
  List,
  Card,
  Grid,
  useMediaQuery,
  useTheme,
  ButtonBase,
  ListItemButton,
  Stack,
  Collapse,
  Button,
  ButtonGroup,
  IconButton,
  ListItem,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DoneIcon from "@mui/icons-material/Done";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const categories: string[] = [
  "Antipasti",
  "Primi",
  "Secondi",
  "Desserts",
  "Bevande",
];

interface SelectedItem {
  category: string;
  productName: string;
}

function Home() {
  const theme = useTheme();

  const [showingQuantityButtons, setShowingQuantityButtons] = useState<
    Record<string, boolean>
  >({});
  const {
    selectedItems,
    setSelectedItems,
    products,
    quantitySelectedMap,
    setQuantitySelectedMap,
    total,
    handleDeleteCart,
    user,
  } = useContext(UserContext);
  const navigate = useNavigate();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleListClose = () => {
    setOpen(false);
  };

  const handleCheckout = () => {
    // Aggiungi un ritardo prima di navigare
    setTimeout(() => {
      navigate("/checkout");
    }, 210); // 200 millisecondi di ritardo prima della navigazione
  };

  const handleCardClick = (productName: string) => {
    setShowingQuantityButtons((prev) => ({
      ...prev,
      [productName]: !showingQuantityButtons[productName],
    }));
    if (
      quantitySelectedMap[productName] == 0 ||
      quantitySelectedMap[productName] == undefined
    ) {
      setQuantitySelectedMap((prevMap) => ({
        ...prevMap,
        [productName]: 1,
      }));
    }
  };

  const isItemSelected = (category: string, productName: string) => {
    return selectedItems.some(
      (item) => item.category === category && item.productName === productName
    );
  };

  const getQuantityButton = (category: string, productName: string) => {
    const handleIncrement = () => {
      setQuantitySelectedMap((prevMap) => ({
        ...prevMap,
        [productName]: prevMap[productName] + 1,
      }));
    };

    const handleDecrement = () => {
      setQuantitySelectedMap((prevMap) =>
        prevMap[productName] > 0
          ? {
              ...prevMap,
              [productName]: prevMap[productName] - 1,
            }
          : prevMap
      );
    };

    const handleDone = async (category: string, productName: string) => {
      const selectedItem: SelectedItem = {
        category,
        productName,
      };
      setShowingQuantityButtons((prev) => ({
        ...prev,
        [productName]: false,
      }));
      if (
        selectedItems.find((x) => x.productName == productName) == undefined &&
        quantitySelectedMap[productName]
      ) {
        setSelectedItems((prevSelectedItems: SelectedItem[]) => [
          ...prevSelectedItems,
          selectedItem,
        ]);
        if (user) {
          try {
            const q = query(
              collection(db, `users/${user.email}/cart`),
              where("productName", "==", productName)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
              const docRef = doc(
                db,
                `users/${user.email}/cart`,
                querySnapshot.docs[0].id
              );
              updateDoc(docRef, {
                quantità: quantitySelectedMap[productName],
              });
            } else {
              await addDoc(collection(db, `users/${user.email}/cart`), {
                category: category,
                productName: productName,
                quantità: quantitySelectedMap[productName],
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        if (quantitySelectedMap[productName]) {
          if (user) {
            try {
              const q = query(
                collection(db, `users/${user.email}/cart`),
                where("productName", "==", productName)
              );
              const querySnapshot = await getDocs(q);
              const docRef = doc(
                db,
                `users/${user.email}/cart`,
                querySnapshot.docs[0].id
              );
              updateDoc(docRef, {
                quantità: quantitySelectedMap[productName],
              });
            } catch (error) {
              console.log(error);
            }
          }
        } else {
          handleDelete();
        }
      }
    };

    const handleDelete = async () => {
      setShowingQuantityButtons((prev) => ({
        ...prev,
        [productName]: false,
      }));
      setQuantitySelectedMap((prevMap) => ({
        ...prevMap,
        [productName]: 0,
      }));

      if (selectedItems.find((x) => x.productName == productName)) {
        setSelectedItems((prevSelectedItems: SelectedItem[]) => {
          return prevSelectedItems.filter(
            (item) => item.productName !== productName
          );
        });
        if (user) {
          try {
            const q = query(
              collection(db, `users/${user.email}/cart`),
              where("productName", "==", productName)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.docs.forEach((docSnapshot) => {
              const docRef = doc(
                db,
                `users/${user.email}/cart`,
                docSnapshot.id
              );
              deleteDoc(docRef);
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    };

    return (
      <Stack direction={"column"} mb={1}>
        <ButtonGroup sx={{ justifyContent: "center" }} fullWidth>
          <Button
            variant="contained"
            onClick={handleIncrement}
            disableElevation
          >
            <AddIcon />
          </Button>
          <Button variant="outlined">
            <Typography variant="h6">
              {quantitySelectedMap[productName]}
            </Typography>
          </Button>
          <Button
            variant="contained"
            onClick={handleDecrement}
            disableElevation
          >
            <RemoveIcon />
          </Button>
        </ButtonGroup>
        <Box
          mt={1}
          mx={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <IconButton
            size="large"
            onClick={() => handleDone(category, productName)}
            sx={{
              "&:hover": {
                color: "green",
                backgroundColor: "lightgreen",
              },
              "&.Mui-selected:hover": {
                color: "green",
                backgroundColor: "lightgreen",
              },
            }}
          >
            <DoneIcon fontSize="large" />
          </IconButton>
          <IconButton
            size="large"
            onClick={handleDelete}
            sx={{
              "&:hover": {
                color: "red",
                backgroundColor: "#FFCCCB",
              },
              "&.Mui-selected:hover": {
                color: "red",
                backgroundColor: "#FFCCCB",
              },
            }}
          >
            <DeleteIcon fontSize="large" />
          </IconButton>
        </Box>
      </Stack>
    );
  };

  const getCategoryList = () =>
    isSmScreen ? (
      <List disablePadding sx={{ minWidth: 180 }}>
        {categories.map((category) => (
          <ListItem disablePadding key={category}>
            <ListItemButton
              onClick={() => {
                setSelectedCategory((prevCategory) =>
                  prevCategory === category ? null : category
                );
              }}
              selected={selectedCategory === category}
              sx={{
                justifyContent: "start",
                borderRadius: 1.5,
                my: 1,
                py: 2,
                "&.Mui-selected": {
                  backgroundColor:
                    theme.palette.mode == "dark"
                      ? "secondary.main"
                      : "primary.main",
                  color:
                    theme.palette.mode == "dark"
                      ? "secondary.contrastText"
                      : "primary.contrastText",
                },
                "&:hover": {
                  backgroundColor:
                    theme.palette.mode == "dark"
                      ? "secondary.main"
                      : "primary.main",
                  color:
                    theme.palette.mode == "dark"
                      ? "secondary.contrastText"
                      : "primary.contrastText",
                },
                "&.Mui-selected:hover": {
                  backgroundColor:
                    theme.palette.mode == "dark"
                      ? "secondary.main"
                      : "primary.main",
                  color:
                    theme.palette.mode == "dark"
                      ? "secondary.contrastText"
                      : "primary.contrastText",
                },
              }}
            >
              <Typography variant="h5">{category}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleDeleteCart}
            sx={{
              justifyContent: "start",
              borderRadius: 1.5,
              my: 1,
              py: 2,
              backgroundColor: "error.main",
              "&.Mui-selected": {
                backgroundColor: "error.main",
                color: "error.contrastText",
              },
              "&:hover": {
                backgroundColor: "error.main",
                color: "error.contrastText",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "error.main",
                color: "error.contrastText",
              },
            }}
          >
            <Typography variant="h5" display="flex" flexGrow={1}>
              Delete
            </Typography>
            <DeleteIcon fontSize="large" />
          </ListItemButton>
        </ListItem>
      </List>
    ) : (
      <>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <ListItemButton
              onClick={handleDeleteCart}
              sx={{
                borderRadius: 1.5,
                my: 1,
                justifyContent: "center",
                py: 2,
                "&.Mui-selected": {
                  backgroundColor: "error.main",
                  color: "error.contrastText",
                },
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "error.contrastText",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "error.main",
                  color: "error.contrastText",
                },
              }}
            >
              <Typography variant="h5">Delete</Typography>
              <DeleteIcon fontSize="large" />
            </ListItemButton>
          </Grid>
          <Grid item xs>
            <Box
              color="inherit"
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              justifyContent="center"
            >
              <ShoppingCartIcon fontSize="large" sx={{ mr: 1 }} />
              <Typography variant="h5" fontWeight={"bold"}>
                {total.toFixed(2) + " €"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <List disablePadding sx={{ minWidth: 180 }}>
          <ListItemButton
            onClick={handleClick}
            sx={{
              justifyContent: "center",
              borderRadius: 1.5,
              py: 2,
            }}
          >
            <Typography variant="h5">Categorie</Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories.map((category) => (
                <ListItemButton
                  key={category}
                  onClick={() => {
                    setSelectedCategory((prevCategory) =>
                      prevCategory === category ? null : category
                    );
                    handleListClose();
                  }}
                  selected={selectedCategory === category}
                  sx={{
                    mx: 5,
                    justifyContent: "center",
                    borderRadius: 1.5,
                    my: 1,
                    py: 2,
                    "&.Mui-selected": {
                      backgroundColor:
                        theme.palette.mode == "dark"
                          ? "secondary.main"
                          : "primary.main",
                      color:
                        theme.palette.mode == "dark"
                          ? "secondary.contrastText"
                          : "primary.contrastText",
                    },
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode == "dark"
                          ? "secondary.main"
                          : "primary.main",
                      color:
                        theme.palette.mode == "dark"
                          ? "secondary.contrastText"
                          : "primary.contrastText",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor:
                        theme.palette.mode == "dark"
                          ? "secondary.main"
                          : "primary.main",
                      color:
                        theme.palette.mode == "dark"
                          ? "secondary.contrastText"
                          : "primary.contrastText",
                    },
                  }}
                >
                  <Typography variant="h5">{category}</Typography>
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </List>
      </>
    );

  const getProduct = (category: string) => {
    return (
      <Grid container rowSpacing={2} columnSpacing={2}>
        {products[category].map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} xl={2.5}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 2,
                style: {
                  border: `2px solid red`,
                },
              }}
              elevation={theme.palette.mode == "dark" ? 7 : 10}
            >
              {!showingQuantityButtons[product.nome] ? (
                <ButtonBase sx={{ width: "100%" }}>
                  <Card
                    elevation={7}
                    sx={{
                      padding: 2,
                      flex: 1,
                      "&.selected": {
                        backgroundColor: "green",
                        color: "primary.contrastText",
                      },
                    }}
                    className={
                      isItemSelected(category, product.nome) ? "selected" : ""
                    }
                    onClick={() => {
                      handleCardClick(product.nome);
                    }}
                  >
                    <Typography variant="h6">{product.nome}</Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
                      {product.prezzo} €
                    </Typography>
                  </Card>
                </ButtonBase>
              ) : (
                getQuantityButton(category, product.nome)
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box mx={4} mb={5} textAlign={isSmScreen ? "start" : "center"}>
      <Stack
        mt={3}
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Typography
          variant="h3"
          sx={{
            display: { xs: "none", sm: "block" },
            userSelect: "none",
          }}
        >
          {selectedCategory || "Select Products"}
        </Typography>
        <Box
          color="inherit"
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
        >
          <ShoppingCartIcon fontSize={"large"} />
          <Typography
            variant={"h4"}
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
      <Stack direction={isSmScreen ? "row" : "column"} mt={isSmScreen ? 3 : 0}>
        <Box
          mr={isSmScreen ? 6 : 0}
          mb={3}
          position={isSmScreen ? "sticky" : "unset"}
          sx={{
            top: isSmScreen ? "inherit" : "100",
            maxHeight: isSmScreen ? "180px" : "inherit",
          }}
        >
          {getCategoryList()}
        </Box>
        {selectedCategory && (
          <Box flexGrow={1} mx={isSmScreen ? 0 : 3}>
            {getProduct(selectedCategory)}
          </Box>
        )}
      </Stack>
      <Fab
        onClick={handleCheckout}
        variant="extended"
        color={theme.palette.mode == "dark" ? "secondary" : "primary"}
        sx={{
          display: { xs: "none", md: "flex" },
          bottom: 40,
          right: 30,
          position: "absolute",
          py: 4,
          px: 3,
        }}
      >
        <Typography variant="h6" fontWeight={"bold"}>
          Checkout
        </Typography>
        <SendIcon sx={{ ml: 1 }} />
      </Fab>
    </Box>
  );
}

export default Home;
