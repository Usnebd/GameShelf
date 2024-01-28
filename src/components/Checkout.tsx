import {
  Box,
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useContext } from "react";
import { UserContext } from "../App";

function checkout() {
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { selectedItems, setSelectedItems, findTotal, products } =
    useContext(UserContext);

  return (
    <Box
      mx={isSmScreen ? 5 : 0}
      mb={5}
      textAlign={isSmScreen ? "start" : "center"}
    >
      <Stack
        mt={5}
        direction={"row"}
        justifyContent="space-between"
        alignItems={"flex-start"}
        sx={{ display: { xs: "none", sm: "flex" } }}
      >
        <Typography variant="h3" sx={{ display: { xs: "none", sm: "block" } }}>
          Place your order
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
            {"Total: " + findTotal(selectedItems) + "€"}
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
          adad
        </Box>
        <Box flexGrow={1} mx={isSmScreen ? 0 : 5}>
          adad
        </Box>
      </Stack>
    </Box>
  );
}

export default checkout;
