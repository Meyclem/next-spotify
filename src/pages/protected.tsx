import { SpotifyUser } from "../types/SpotifyUser";
import { NextPage, GetServerSidePropsContext } from "next";
import Cookies from "cookies";

interface Props {
  user: SpotifyUser;
}

const Protected: NextPage<Props> = ({ user }) => {
  return (
    <>
      <h1>Protected</h1>
      <p>Welcome {user && user.display_name}</p>
    </>
  );
};

function getToken(context: GetServerSidePropsContext): string | undefined {
  const cookies = new Cookies(context.req, context.res);
  return cookies.get("spot-next");
}

export const getServerSideProps = async (context: GetServerSidePropsContext): Promise<unknown> => {
  const accessToken = getToken(context);
  if (accessToken) {
    const user = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then(async (res) => await res.json());
    return { props: { user } };
  } else {
    context.res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Protected;
