import { NextPage } from "next";
import { SpotifyUser } from "../components/WithAuth";
import url from "../lib/getLoginUrl";

interface Props {
  user?: SpotifyUser;
}

const Login: NextPage<Props> = () => {
  return (
    <p>
      Please <a href={url}>login</a>
    </p>
  );
};

export default Login;
