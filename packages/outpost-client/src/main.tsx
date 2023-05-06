import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { CharacterSheet } from "./components/characterSheet";
import { Login } from "./login";
import { useUserStore } from "./userStore";
import dayjs from "dayjs";
import axios from "axios";
import { Characters } from "./components/characters";
import { useLocalStorage } from "usehooks-ts";
import "./assets/PirataOne-Gloomhaven.ttf";

const withAuthentication = (Component: React.ComponentType) => (props: any) => {
  const { token, initialized } = useUserStore();

  if (!initialized) return null;

  if (!token) {
    return <Login />;
  } else {
    return <Component {...props} />;
  }
};

const AuthenticatedCharacterSheet = withAuthentication(CharacterSheet);
const AuthenticatedCharacters = withAuthentication(Characters);

const router = createBrowserRouter([
  {
    path: "/characters/:id",
    element: <AuthenticatedCharacterSheet />,
  },
  {
    path: "/",
    element: <AuthenticatedCharacters />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <AuthenticatedCharacters />,
  },
]);

const AuthenticationKeepAlive = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { refresh, token, validUntil, setToken, initialized, setInitialized } =
    useUserStore(
      ({
        refresh,
        validUntil,
        setToken,
        initialized,
        setInitialized,
        token,
      }) => ({
        refresh,
        validUntil,
        token,
        setToken,
        initialized,
        setInitialized,
      })
    );
  const [refreshFromStorage, setRefreshFromStorage] = useLocalStorage(
    "refresh",
    ""
  );
  const [tokenFromStorage, setTokenFromStorage] = useLocalStorage("token", "");

  const refreshToken = async (refresher: string) => {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    };
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/token/refresh/`,
      {
        refresh: refresher,
      },
      requestOptions
    );
    axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;

    setToken(data.access, data.refresh);
  };

  useEffect(() => {
    if (initialized) return;
    if (!tokenFromStorage || !refreshFromStorage) {
      setInitialized();
      return;
    }
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${tokenFromStorage}`;
    refreshToken(refreshFromStorage)
      .catch(() => {
        "token expired";
      })
      .then(() => {
        setInitialized();
      });
  }, [refreshFromStorage, initialized]);

  useEffect(() => {
    if (!validUntil || !refresh) return;
    const timeout = setTimeout(() => {
      refreshToken(refresh);
    }, dayjs(validUntil).subtract(10, "seconds").diff(dayjs(), "milliseconds"));

    return () => {
      clearTimeout(timeout);
    };
  }, [validUntil, refresh]);

  useEffect(() => {
    if (!refresh) return;
    setRefreshFromStorage(refresh);
  }, [refresh]);

  useEffect(() => {
    if (!token) return;
    setTokenFromStorage(token);
  }, [token]);

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthenticationKeepAlive>
      <RouterProvider router={router} />
    </AuthenticationKeepAlive>
  </React.StrictMode>
);
