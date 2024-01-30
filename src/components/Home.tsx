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
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DoneIcon from "@mui/icons-material/Done";

const categories: string[] = [
  "Antipasti",
  "Primi",
  "Secondi",
  "Dessert",
  "Bevande",
];

interface SelectedItem {
  category: string;
  productName: string;
}

function Home() {
  const theme = useTheme();
  const navigate = useNavigate();

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
  } = useContext(UserContext);
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleListClose = () => {
    setOpen(false);
  };

  const handleCardClick = (category: string, productName: string) => {
    const selectedItem: SelectedItem = {
      category,
      productName,
    };

    // Rimuovi l'elemento selezionato se è già presente nella lista
    const updatedSelectedItems = selectedItems.filter(
      (item) =>
        item.category !== selectedItem.category ||
        item.productName !== selectedItem.productName
    );

    setSelectedItems((prevSelectedItems: SelectedItem[]) =>
      updatedSelectedItems.length === prevSelectedItems.length
        ? [...prevSelectedItems, selectedItem]
        : updatedSelectedItems
    );
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
      if (quantitySelectedMap[productName] === 0) {
        handleCardClick(category, productName);
      }
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
      if (
        quantitySelectedMap[productName] === 1 &&
        selectedItems.find((item) => item.productName === productName)
      ) {
        handleCardClick(category, productName);
      }
    };

    const handleDone = () => {
      setShowingQuantityButtons((prev) => ({
        ...prev,
        [productName]: false,
      }));
      if (
        quantitySelectedMap[productName] > 0 &&
        !selectedItems.find((item) => item.productName === productName)
      ) {
        handleCardClick(category, productName);
      } else if (
        quantitySelectedMap[productName] === 0 &&
        selectedItems.find((item) => item.productName === productName)
      ) {
        handleCardClick(category, productName);
      }
    };

    const handleDelete = () => {
      setShowingQuantityButtons((prev) => ({
        ...prev,
        [productName]: false,
      }));
      setQuantitySelectedMap((prevMap) => ({
        ...prevMap,
        [productName]: 0,
      }));
      if (
        quantitySelectedMap[productName] > 0 &&
        selectedItems.find((item) => item.productName === productName)
      ) {
        handleCardClick(category, productName);
      }
    };

    return (
      <Stack direction={"column"} mb={1}>
        <ButtonGroup sx={{ justifyContent: "center" }} fullWidth>
          <Button variant="contained" onClick={handleIncrement}>
            <AddIcon />
          </Button>
          <Button variant="outlined">
            <Typography variant="h6">
              {quantitySelectedMap[productName]}
            </Typography>
          </Button>
          <Button variant="contained" onClick={handleDecrement}>
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
            onClick={handleDone}
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
        <Stack direction="column" spacing={2}>
          {categories.map((category) => (
            <ListItemButton
              key={category}
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
          ))}
          <ListItemButton
            onClick={() => {
              setSelectedItems([]);
            }}
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
        </Stack>
      </List>
    ) : (
      <>
        <Grid container spacing={2}>
          <Grid item xs>
            <ListItemButton
              onClick={() => {
                setSelectedItems([]);
              }}
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
            <ListItemButton
              sx={{
                justifyContent: "center",
                borderRadius: 1.5,
                my: 1,
                py: 2,
              }}
              onClick={() => navigate("/checkout")}
            >
              <ShoppingCartIcon fontSize="large" sx={{ mr: 1 }} />
              <Typography variant="h5">{total.toFixed(2) + " €"}</Typography>
            </ListItemButton>
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
          <Grid item key={product.nome} xs={12} sm={6} md={4} lg={3}>
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
                      setShowingQuantityButtons((prev) => ({
                        ...prev,
                        [product.nome]: true,
                      }));
                      if (
                        quantitySelectedMap[product.nome] == 0 ||
                        quantitySelectedMap[product.nome] == undefined
                      ) {
                        setQuantitySelectedMap((prevMap) => ({
                          ...prevMap,
                          [product.nome]: 1,
                        }));
                        handleCardClick(category, product.nome);
                      }
                    }}
                  >
                    <Typography variant="h6">{product.nome}</Typography>
                    <Typography variant="body1">${product.prezzo}</Typography>
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
    <Box
      mx={isSmScreen ? 5 : 0}
      mb={5}
      textAlign={isSmScreen ? "start" : "center"}
    >
      <Stack
        mt={4}
        direction={"row"}
        justifyContent="space-between"
        alignItems={"flex-start"}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Typography
          variant="h3"
          sx={{
            display: { xs: "none", sm: "block" },
            userSelect: "none",
          }}
        >
          {selectedCategory ? selectedCategory : "Select Products"}
        </Typography>
        <Button
          color="inherit"
          sx={{
            borderRadius: 1.5,
            p: 1.7,
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
          onClick={() => {
            navigate("/checkout");
          }}
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
        </Button>
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
          <Box flexGrow={1} mx={isSmScreen ? 0 : 11}>
            {getProduct(selectedCategory)}
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default Home;
