"use client";
import React, { useEffect, useContext } from "react";

export type userProps = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type UserContextType = {
  userData: userProps | undefined;
  setUserData: React.Dispatch<React.SetStateAction<userProps | undefined>>;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [userData, setUserData] = React.useState<userProps | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/parsecookie");
        if (response.status !== 200) {
          return;
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setUserData(undefined);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const value = {
    userData,
    setUserData,
    isLoading,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
