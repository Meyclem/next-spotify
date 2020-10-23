import { SpotifyUser } from "../types/SpotifyUser";
import { NextPage, GetServerSidePropsContext } from "next";
import Cookies from "cookies";
import useSpotifyPlayer from "../hooks/useSpotifyPlayer";
import { useUser } from "../contexts/UserContext";

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

const Playlists: NextPage<Props> = ({ accessToken }) => {
  const { user } = useUser();
  // const { togglePlay, paused, changeVolume, volume } = useSpotifyPlayer(user ? user.accessToken : undefined);
  const { togglePlay, paused, changeVolume, volume } = useSpotifyPlayer(accessToken);

  return (
    <>
      <h1>Player</h1>
      <p>Welcome {user && user.display_name}</p>
      <button onClick={(): void => togglePlay()}>{paused ? ">" : "||"}</button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100}
        onChange={(event): void => {
          changeVolume(parseFloat(event.target.value) / 100);
        }}
      />
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
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
    return { props: { accessToken } };
  } else {
    context.res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Playlists;
