import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";

function Menu() {
  const actions = [
    { icon: <SaveIcon />, name: "Save" },
    { icon: <ShareIcon />, name: "Share" },
  ];

  return (
    <Box
      position="fixed"
      sx={{
        bottom: "16px",
        right: "16px",
      }}
    >
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}

export default Menu;
