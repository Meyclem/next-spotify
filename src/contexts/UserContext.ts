import { createContext, useState, Dispatch, SetStateAction, Context } from "react";
import { SpotifyUser } from "../components/WithAuth";

type IUserContext = {
  user?: SpotifyUser;
};

type UserDispatcher = Dispatch<SetStateAction<SpotifyUser | null>>;

export const UserContext = createContext({} as IUserContext);

export const useUserDispatchContext = (user: SpotifyUser | null = null): [UserDispatcher, Context<UserDispatcher>] => {
  const [, setUser] = useState<SpotifyUser | null>(user);
  return [setUser, createContext(setUser)];
};
