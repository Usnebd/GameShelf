import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  List,
  ListItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

function Orders() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const isSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const {
    selectedItems,
    products,
    quantitySelectedMap,
    setQuantitySelectedMap,
    total,
    user,
    setSelectedItems,
  } = useContext(UserContext);

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
          Orders
        </Typography>
      </Stack>
      <Stack
        direction={isSmScreen ? "row" : "column"}
        mt={isSmScreen ? 10 : 0}
        mx={isSmScreen ? 0 : 5}
      >
        <Stack
          direction={"column"}
          spacing={3}
          mr={isSmScreen ? 6 : 0}
          mb={12}
          mt={isSmScreen ? 0 : 5}
        >
          <Button>
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Modify Order
            </Typography>
          </Button>
          <Button>
            <Typography variant="h6" fontWeight={"bold"} flex={1} flexGrow={1}>
              Place Order
            </Typography>
          </Button>
          <Box>
            <Typography>puppa</Typography>
          </Box>
        </Stack>
        <Box flexGrow={1} mx={isSmScreen ? 0 : 5}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              Accordion 2
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
        </Box>
      </Stack>
    </Box>
  );
}

export default Orders;
