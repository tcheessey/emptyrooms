import axios from "axios";
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type AuthUser = {
  id: number;
  username: string;
  isAdmin: boolean;
};

type Credentials = {
  username: string;
  password: string;
};

type AuthContextValue = {
  isCheckingAuth: boolean;
  isLoggedIn: boolean;
  userData: AuthUser | null;
  login: (credentials: Credentials, onError?: (message: string) => void) => void;
  register: (credentials: Credentials, onError?: (message: string) => void) => void;
  logout: () => void;
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? "Something went wrong";
  }

  return "Something went wrong";
};

export const AuthContext = createContext<AuthContextValue>({
  isCheckingAuth: true,
  isLoggedIn: false,
  userData: null,
  login: () => undefined,
  register: () => undefined,
  logout: () => undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<AuthUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/checkAuth")
      .then((response) => {
        if (response.data.success) {
          setIsLoggedIn(true);
          setUserData(response.data.user);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUserData(null);
      })
      .finally(() => setIsCheckingAuth(false));
  }, []);

  const login = useCallback(({ username, password }: Credentials, onError?: (message: string) => void) => {
    axios
      .post("/api/login", { username, password })
      .then((response) => {
        setIsLoggedIn(true);
        setUserData(response.data.user);
        navigate("/");
      })
      .catch((error) => onError?.(getErrorMessage(error)));
  }, [navigate]);

  const register = useCallback(({ username, password }: Credentials, onError?: (message: string) => void) => {
    axios
      .post("/api/register", { username, password })
      .then((response) => {
        setIsLoggedIn(true);
        setUserData(response.data.user);
        navigate("/");
      })
      .catch((error) => onError?.(getErrorMessage(error)));
  }, [navigate]);

  const logout = useCallback(() => {
    axios.post("/api/logout").finally(() => {
      setIsLoggedIn(false);
      setUserData(null);
      navigate("/welcome");
    });
  }, [navigate]);

  const value = useMemo(
    () => ({ isCheckingAuth, isLoggedIn, userData, login, register, logout }),
    [isCheckingAuth, isLoggedIn, login, logout, register, userData]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
