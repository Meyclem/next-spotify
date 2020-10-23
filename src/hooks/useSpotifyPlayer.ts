import { useEffect, useState } from "react";
import logger from "../utils/logger";

type PlayerEventCallback = (args: State) => void;

type SpotifyPlayer = {
  paused: boolean;
  volume: number;
  changeVolume: (value: number) => void;
  togglePlay: () => void;
};

type SpotifyWindow = Window &
  typeof globalThis & {
    onSpotifyWebPlaybackSDKReady: () => void;
  };

type State = {
  message: string;
  device_id: string;
  paused: boolean;
};

const useSpotifyPlayer = (accessToken?: string): SpotifyPlayer => {
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [deviceId, setId] = useState("");

  const changeVolume = (value: number): void => {
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

  const togglePlay = (): void => {
    fetch(`https://api.spotify.com/v1/me/player/${paused ? "play" : "pause"}?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };

  const basicErrorHandling: PlayerEventCallback = () => {
    // console.error(message);
  };

  const stateUpdate: PlayerEventCallback = (state: { paused: boolean }) => {
    // console.log("state: ", state);
    setPaused(state.paused);
  };

  const initPlayer: PlayerEventCallback = ({ device_id }) => {
    logger.log("Ready with Device ID", device_id);

    fetch("https://api.spotify.com/v1/me/player", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        device_ids: [device_id],
      }),
    });
  };

  const deviceDisconnected: PlayerEventCallback = ({ device_id }) => {
    logger.log("Device ID has gone offline", device_id);
  };

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    logger.log("🔑 Access Token\n", accessToken, "\n🔑");

    function init(): void {
      (window as SpotifyWindow).onSpotifyWebPlaybackSDKReady = (): void => {
        // eslint-disable-next-line
        // @ts-ignore
        const player = new Spotify.Player({
          name: "Spot-next",
          getOAuthToken: (cb: (accessToken: string) => void): void => {
            cb(accessToken || "");
          },
          volume,
        });

        setId(player._options.id);

        player.addListener("initialization_error", basicErrorHandling);
        player.addListener("authentication_error", basicErrorHandling);
        player.addListener("account_error", basicErrorHandling);
        player.addListener("playback_error", basicErrorHandling);
        player.addListener("player_state_changed", stateUpdate);
        player.addListener("ready", initPlayer);
        player.addListener("not_ready", deviceDisconnected);
        player.connect();
      };
    }

    init();
  }, [accessToken]);

  return {
    paused,
    togglePlay,
    changeVolume,
    volume,
  };
};

export default useSpotifyPlayer;
