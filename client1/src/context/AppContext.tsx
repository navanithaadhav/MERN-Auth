/// <reference types="vite/client" />
import axios from "axios";
import { useEffect, createContext, useState } from "react";
import { toast } from "react-toastify";

export interface AppContextType {
  backendUrl: string;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  getUserData: () => Promise<void>;
}

// Only named exports, no default export
export const AppContext = createContext<AppContextType>(null as any);

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(false);
      }
    } catch (error: any) {
      // 401 is expected when user is not authenticated - don't show error
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
      setIsLoggedIn(false);
      setUserData(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data');
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}