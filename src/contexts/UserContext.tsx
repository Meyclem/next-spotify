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

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [user, setUser] = useState<SpotifyUser | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextProps {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

/**
 * Foo useUser
 *  Context
 *    Layout useUser
 *  Context
 * Foo
 */

// type UserDispatcher = Dispatch<SetStateAction<SpotifyUser | null>>;

// export const UserContext = createContext({} as UserContextProps);

// export const useUserDispatchContext = (user: SpotifyUser | null = null): [UserDispatcher, Context<UserDispatcher>] => {
//   const [, setUser] = useState<SpotifyUser | null>(user);
//   return [setUser, createContext(setUser)];
// };
