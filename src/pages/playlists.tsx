import { SpotifyUser } from "../types/SpotifyUser";
import { NextPage, GetServerSidePropsContext } from "next";
import Cookies from "cookies";

interface Props {
  user: SpotifyUser;
  playlists: {
    items: {
      id: string;
      name: string;
    }[];
  };
}

const Playlists: NextPage<Props> = ({ user, playlists }) => {
  console.log(playlists);
  return (
    <>
      <h1>Playlists</h1>
      <p>Welcome {user && user.display_name}</p>
      <iframe
        src="https://open.spotify.com/embed/playlist/4xDQj2UgpW3T83rcuuWrqz"
        width="300"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
      ></iframe>

      <ul>
        {playlists.items.map((playlist) => {
          return <li key={playlist.id}>{playlist.name}</li>;
        })}
      </ul>
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
    const [user, playlists] = await Promise.all([
      await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => res.json()),
      await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => res.json()),
    ]);
    return { props: { user, playlists } };
  } else {
    context.res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Playlists;
