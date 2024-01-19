import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { amber, indigo } from "@mui/material/colors";
import { Container, CssBaseline, useMediaQuery } from "@mui/material";
import { useMemo } from "react";
import { Navbar } from "./components/Navbar";
import Content from "./components/Content";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: indigo,
          secondary: amber,
          mode: mode ? "dark" : "light",
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar mode={mode} toggleMode={toggleMode}></Navbar>
      <Container>
        <Content></Content>
      </Container>
    </ThemeProvider>
  );
}

export default App;
