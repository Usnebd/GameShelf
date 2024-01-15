import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/material";

function Navbar() {
  const pages = ["Home", "Menu", "Orders"];
  return (
    <AppBar
      position="static"
      sx={{
        backdropFilter: "blur(8px)",
        boxShadow: 5,
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { xs: "block", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ userSelect: "none", fontWeight: "bold" }}
        >
          MyChiosco
        </Typography>
        <Box pl={2} sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
          <Stack spacing={1} direction="row">
            {pages.map((page) => (
              <Button key={page} variant="text" color="secondary">
                <Typography>{page}</Typography>
              </Button>
            ))}
          </Stack>
        </Box>
        <Stack spacing={1} direction="row">
          <Button variant="outlined" color="secondary">
            Sign in
          </Button>
          <Button variant="contained" color="secondary">
            Sign Up
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
