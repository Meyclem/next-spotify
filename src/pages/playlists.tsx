import { NextPage, GetServerSidePropsContext } from "next";
import Cookies from "cookies";
import { useUser } from "../contexts/UserContext";

interface Props {
  playlists: {
    items: {
      id: string;
      name: string;
    }[];
  };
}

const Playlists: NextPage<Props> = ({ playlists }) => {
  const { user } = useUser();

  return (
    <>
      <h1>Playlists</h1>
      <p>Welcome {user && user.display_name}</p>

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
    const [playlists] = await Promise.all([
      await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => res.json()),
    ]);
    return { props: { playlists } };
  } else {
    context.res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Playlists;
