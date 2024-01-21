import { Box, Typography } from "@mui/material";

function NotFound() {
  return (
    <Box
      sx={{
        marginTop: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h3">404 - Pagina non trovata</Typography>
    </Box>
  );
}

export default NotFound;
