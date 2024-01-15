import { ModeNight } from "@mui/icons-material";
import "./Sidebar.css";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  Switch,
  Typography,
} from "@mui/material";

export default function Sidebar() {
  return (
    <Box
      flex={1}
      p={1}
      sx={{
        backgroundColor: "yellow",
        height: "100%",
        display: { xs: "none", sm: "block" },
      }}
    >
      <List>
        <ListItem>
          <Typography>add</Typography>
        </ListItem>
        <ListItem>
          <Typography>add</Typography>
        </ListItem>
        <ListItem>
          <Typography>add</Typography>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ModeNight></ModeNight>
          </ListItemIcon>
          <Switch></Switch>
        </ListItem>
      </List>
    </Box>
  );
}
