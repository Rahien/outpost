import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { spacing } from "./tokens";
import { useUserStore } from "./userStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Title } from "./components/Title";
import { Card } from "./components/card";

export const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { setUsername: storeUsername, setToken } = useUserStore(
    ({ username, setUsername, setToken }) => ({
      username,
      setUsername,
      setToken,
    })
  );

  const passwordOk = password === password2 && password !== "";
  const allOk = passwordOk && username.trim() !== "" && email.trim() !== "";
  const login = async () => {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/register/`,
      {
        username,
        email,
        password,
      },
      requestOptions
    );
    axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;

    setUsername(username);
    setToken(data.access, data.refresh);
    navigate("/");
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
        <Title title="Register" />

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
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <TextField
            label="Password (again)"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && allOk) {
                login();
              }
            }}
          />

          <div
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={login} variant="outlined" disabled={!allOk}>
              Register
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outlined"
              css={{ marginLeft: spacing.small }}
            >
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
