import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function Menu() {
  return (
    <Box
      position="fixed"
      sx={{
        bottom: "16px",
        right: "16px",
      }}
    >
      <Fab size="large" color="secondary" aria-label="add">
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default Menu;
