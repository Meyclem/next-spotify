import { SpotifyUser } from "../types/SpotifyUser";
import { NextPage, GetServerSidePropsContext } from "next";
import Cookies from "cookies";
import { useEffect, useState } from "react";

interface Props {
  user: SpotifyUser;
  accessToken: string;
}

const togglePlay = (accessToken: string, state: boolean, deviceId: string): void => {
  fetch(`https://api.spotify.com/v1/me/player/${state ? "play" : "pause"}?device_id=${deviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const Playlists: NextPage<Props> = ({ user, accessToken }) => {
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [deviceId, setId] = useState("");

  const changeVolume = (value: number, deviceId: string) => {
    setVolume(value);
    fetch(
      `https://api.spotify.com/v1/me/player/volume?device_id=${deviceId}&volume_percent=${Math.floor(value * 100)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  };

  useEffect(() => {
    console.log("🔐", accessToken);
    window.onSpotifyWebPlaybackSDKReady = (): void => {
      const player = new Spotify.Player({
        name: "Spot-next",
        getOAuthToken: (cb: (accessToken: string) => void): void => {
          cb(accessToken);
        },
        volume,
      });

      setId(player._options.id);

      // Error handling
      // player.addListener("initialization_error", ({ message }) => {
      //   console.error(message);
      // });
      // player.addListener("authentication_error", ({ message }) => {
      //   console.error(message);
      // });
      // player.addListener("account_error", ({ message }) => {
      //   console.error(message);
      // });
      // player.addListener("playback_error", ({ message }) => {
      //   console.error(message);
      // });

      // Playback status updates
      player.addListener("player_state_changed", (state: { paused: boolean }) => {
        console.log("state: ", state);
        setPaused(state.paused);
      });

      // Ready
      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            device_ids: [device_id],
          }),
        });
      });

      player.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, []);
  return (
    <>
      <h1>Playlists</h1>
      <p>Welcome {user && user.display_name}</p>
      <button onClick={(): void => togglePlay(accessToken, paused, deviceId)}>{paused ? ">" : "||"}</button>
      <input
        type="range"
        min="0"
        max="100"
        value={volume * 100}
        onChange={(event): void => {
          changeVolume(parseFloat(event.target.value) / 100, deviceId);
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
    const [user] = await Promise.all([
      await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }).then(async (res) => res.json()),
    ]);
    return { props: { user, accessToken } };
  } else {
    context.res.writeHead(307, { Location: "/login" }).end();
  }
};

export default Playlists;
