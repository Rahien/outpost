import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "./userStore";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export const Logout = () => {
  const navigate = useNavigate();
  const { setToken } = useUserStore(({ setToken }) => ({ setToken }));
  const [refreshFromStorage, setRefreshFromStorage] = useLocalStorage(
    "refresh",
    ""
  );
  const [tokenFromStorage, setTokenFromStorage] = useLocalStorage("token", "");

  useEffect(() => {
    axios.defaults.headers.common["Authorization"] = "";
    setToken("", "");
    setTokenFromStorage("");
    setRefreshFromStorage("");
    navigate("/");
  }, []);

  return null;
};
