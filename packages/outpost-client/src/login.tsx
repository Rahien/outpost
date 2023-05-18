import { TextField } from "@mui/material";
import { useState } from "react";
import { spacing } from "./tokens";
import { useUserStore } from "./userStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Title } from "./components/Title";
import { Card } from "./components/card";
import { Button } from "./components/button";

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
  const [errorMessage, setErrorMessage] = useState("");
  const login = async () => {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    setErrorMessage("");
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/token/`,
        {
          username,
          password,
        },
        requestOptions
      );
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data["access"]}`;

      setToken(data.access, data.refresh);
      navigate("/");
    } catch (e: any) {
      if (e?.response?.status === 401) {
        setErrorMessage("Invalid username or password");
      } else {
        setErrorMessage("Something went wrong");
      }
    }
  };

  return (
    <div
      css={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "> div > div:nth-of-type(2)": {
          padding: spacing.large,
        },
      }}
    >
      <Card>
        <Title title="Login" />

        <div
          css={{
            display: "flex",
            flexDirection: "column",
            marginTop: spacing.large,
            "> div.MuiTextField-root": { marginBottom: spacing.small },
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
          <div
            css={{
              color: "red",
              textAlign: "center",
              marginBottom: spacing.small,
              minHeight: "1.2em",
            }}
          >
            {errorMessage}
          </div>

          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={login}>Login</Button>
            <Button
              onClick={() => navigate("/register")}
              css={{ marginLeft: spacing.small }}
            >
              Register
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
