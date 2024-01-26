import { useState } from "react";
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
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface Product {
  name: string;
  price: number;
}

const categories: string[] = [
  "Antipasti",
  "Primi",
  "Secondi",
  "Dessert",
  "Bevande",
];

const products: Record<string, Product[]> = {
  Antipasti: [
    { name: "Bruschetta", price: 8.99 },
    { name: "Mozzarella Sticks", price: 10.99 },
    { name: "Ugga", price: 8.99 },
    { name: "PUppa Sticks", price: 10.99 },
    { name: "Ciccio Sticks", price: 10.99 },
    // Aggiungi altri prodotti per gli antipasti
  ],
  Primi: [
    { name: "Margherita Pizza", price: 12.99 },
    { name: "Pizza napoletana", price: 15.99 },
    // Aggiungi altri piatti principali
  ],
  Secondi: [
    { name: "Maiale alla piastra", price: 12.99 },
    { name: "Chicken Alfredo", price: 15.99 },
    // Aggiungi altri piatti principali
  ],
  Bevande: [
    { name: "CocaCola", price: 12.99 },
    { name: "Acqua", price: 15.99 },
    // Aggiungi altri piatti principali
  ],
  Dessert: [
    { name: "Tiramisu", price: 7.99 },
    { name: "Chocolate Cake", price: 9.99 },
    // Aggiungi altri dessert
  ],
};

interface SelectedItem {
  category: string;
  productName: string;
}

function Home() {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleListClose = () => {
    setOpen(false);
  };

  const findTotal = (selectedItems: SelectedItem[]) => {
    return selectedItems
      .reduce((total, item) => {
        const product = products[item.category].find(
          (p) => p.name === item.productName
        );
        const productPrice = product ? product.price : 0;
        return total + productPrice;
      }, 0)
      .toFixed(2);
  };

  const handleCardClick = (category: string, productName: string) => {
    const selectedItem: SelectedItem = { category, productName };

    // Rimuovi l'elemento selezionato se è già presente nella lista
    const updatedSelectedItems = selectedItems.filter(
      (item) =>
        item.category !== selectedItem.category ||
        item.productName !== selectedItem.productName
    );

    setSelectedItems((prevSelectedItems) =>
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
        </Stack>
      </List>
    ) : (
      <List disablePadding sx={{ minWidth: 180 }}>
        <Stack direction={"row"} spacing={2} mb={1}>
          <ListItemButton
            onClick={handleClick}
            sx={{
              justifyContent: "center",
              borderRadius: 1.5,
              my: 1,
              py: 2,
            }}
          >
            <Typography variant="h5">Categorie</Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <ListItemButton
            sx={{
              justifyContent: "center",
              borderRadius: 1.5,
              my: 1,
              py: 2,
            }}
          >
            <Typography variant="h5" display="flex" alignItems="center">
              <ShoppingCartIcon fontSize="large" />
              Totale: {findTotal(selectedItems) + " €"}
            </Typography>
          </ListItemButton>
        </Stack>
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
    );

  const getProduct = (category: string) => {
    return (
      <Grid container spacing={3.5}>
        {products[category].map((product) => (
          <Grid item key={product.name} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 2,
                style: {
                  border: `2px solid red`,
                },
              }}
              elevation={theme.palette.mode == "dark" ? 7 : 10}
              onClick={() => handleCardClick(category, product.name)}
            >
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
                    isItemSelected(category, product.name) ? "selected" : ""
                  }
                >
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body1">
                    ${product.price.toFixed(2)}
                  </Typography>
                </Card>
              </ButtonBase>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box
      ml={isMdScreen ? 10 : 2}
      mr={isMdScreen ? 3 : 2}
      textAlign={isSmScreen ? "start" : "center"}
    >
      <Stack
        mt={5}
        mr={1}
        direction={"row"}
        justifyContent="space-between"
        alignItems={"flex-end"}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h3" sx={{ display: { xs: "none", sm: "block" } }}>
          {selectedCategory ? selectedCategory : "Place an order"}
        </Typography>
        <Typography
          variant={isMdScreen ? "h4" : "h5"}
          display="flex"
          alignItems="center"
        >
          <ShoppingCartIcon fontSize="large" />
          Totale: {findTotal(selectedItems) + " €"}
        </Typography>
      </Stack>
      <Stack direction={isSmScreen ? "row" : "column"} mt={6}>
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
          <Box flexGrow={1}>{getProduct(selectedCategory)}</Box>
        )}
      </Stack>
    </Box>
  );
}

export default Home;
