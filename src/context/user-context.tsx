"use client"
import React from "react";

export type userProps = {
  name: string;
  email: string;
  role: string;
};

export type UserContextType = {
  userData: userProps | undefined;
  setUserData: (user: userProps | undefined) => void;
};

const UserContext = React.createContext<UserContextType>({
  userData: undefined,
  setUserData: () => {},
});

export const UserProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [userData, setUserData] = React.useState<userProps | undefined>(
    undefined,
  );
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => React.useContext(UserContext);
