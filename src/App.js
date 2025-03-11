import { Box } from "@mui/material";
import "./App.css";
import { Login, SpellCheck } from "./pages";
import { useState } from "react";

export const USER_LOCAL_STORAGE_KEY = "user";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useState(() => {
    const user = JSON.parse(localStorage.getItem(USER_LOCAL_STORAGE_KEY));
    setIsLoggedIn(!!user);
  }, []);
  return (
    <Box>
      {isLoggedIn ? (
        <SpellCheck onAfterLogout={() => setIsLoggedIn(false)} />
      ) : (
        <Login onAfterLogin={() => setIsLoggedIn(true)} />
      )}
    </Box>
  );
}

export default App;
