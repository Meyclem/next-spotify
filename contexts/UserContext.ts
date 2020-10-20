import { createContext } from "react";
import { SpotifyUser } from "../components/WithAuth";

export const UserContext = createContext({} as SpotifyUser);
