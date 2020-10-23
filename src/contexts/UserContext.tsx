import { createContext, useState, Dispatch, SetStateAction, useContext } from "react";
import { SpotifyUser } from "../types/SpotifyUser";
import React from "react";

type UserProviderProps = {
  children: React.ReactNode | undefined;
};

type UserContextProps = {
  user: SpotifyUser | null;
  setUser: Dispatch<SetStateAction<SpotifyUser | null>>;
};

export const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [user, setUser] = useState<SpotifyUser | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextProps {
  const context = useContext(UserContext);
  const { user, setUser } = context;

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  React.useEffect(() => {
    if (user) {
      setUser(user);
    } else if (!user && document && document.cookie) {
      const cookies = document.cookie
        .split("; ")
        .map((stringifiedCookie) => {
          const [key, value] = stringifiedCookie.split("=");
          const cookie: Record<string, string> = {};
          cookie[key] = value;
          return cookie;
        })
        .reduce((prev, current) => ({ ...prev, ...current }));

      const accessToken = cookies["spot-next"];

      fetch("/api/get-user-info", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then((res) => {
        res.json().then((user) => {
          setUser({ ...user, accessToken });
        });
      });
    }
  }, [user]);

  return context;
}
