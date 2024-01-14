import { Stack } from "@mui/material";
import "./App.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Stack direction="row" justifyContent="space - between">
        <Sidebar></Sidebar>
        <Feed></Feed>
      </Stack>
    </>
  );
}

export default App;
