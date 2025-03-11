import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { USER_LOCAL_STORAGE_KEY } from "../App";

export const Login = ({ onAfterLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    localStorage.setItem(
      USER_LOCAL_STORAGE_KEY,
      JSON.stringify({ username, password })
    );
    onAfterLogin();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box
          component="form"
          onSubmit={onLogin}
          noValidate
          sx={{
            mt: 2,
            gap: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TextField
            required
            fullWidth
            label="Username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              fontSize: 14,
            }}
            InputProps={{
              sx: {
                fontSize: 14,
              },
            }}
            color="#0f0f0f"
          />

          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              fontSize: 14,
            }}
            InputProps={{
              sx: {
                fontSize: 14,
              },
            }}
            color="#0f0f0f"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              my: 2,
              backgroundColor: "#0f0f0f",
            }}
            disabled={!username.trim() || !password.trim()}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
