import { Button, Card, TextField } from "@mui/material";
import { useState } from "react";
import { spacing } from "./tokens";
import { useUserStore } from "./userStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const { username, setUsername, setToken } = useUserStore(
    ({ username, setUsername, setToken }) => ({
      username,
      setUsername,
      setToken,
    })
  );
  const [password, setPassword] = useState("");
  const login = async () => {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/token/`,
      {
        username,
        password,
      },
      requestOptions
    );
    axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;

    setToken(data.access, data.refresh);
    navigate("/");
  };

  return (
    <Card css={{ padding: spacing.medium }}>
      <h1>Login</h1>

      <div
        css={{
          display: "flex",
          flexDirection: "column",
          "> *": { marginBottom: spacing.small },
        }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
        />

        <Button onClick={login}>Login</Button>
      </div>
    </Card>
  );
};
