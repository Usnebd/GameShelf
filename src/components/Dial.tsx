import {
  Backdrop,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DialProps {
  mode: boolean;
  toggleMode: () => void;
  setItem: (value: boolean) => void;
}

export const Dial: React.FC<DialProps> = ({ mode, toggleMode, setItem }) => {
  const navigate = useNavigate();

  const actions = [
    { icon: <HomeIcon />, name: "Home" },
    { icon: <MenuBookIcon />, name: "Menu" },
    { icon: <ShoppingCartIcon />, name: "Orders" },
    {
      icon: mode ? <ModeNightIcon /> : <LightModeIcon />,
      name: "Theme",
    },
  ];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      position="fixed"
      sx={{
        bottom: "16px",
        right: "16px",
        display: { xs: "block", md: "none" },
      }}
    >
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            FabProps={{
              sx: {
                color: mode ? "primary.contrastText" : "secondary.contrastText",
              },
            }}
            onClick={() => {
              handleClose();
              if (action.name !== "Theme") {
                if (action.name !== "Home") {
                  navigate(`/${action.name}`);
                } else {
                  navigate("/");
                }
              } else {
                toggleMode();
                setItem(!mode);
              }
            }}
            tooltipOpen
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default Dial;
