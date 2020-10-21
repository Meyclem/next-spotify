const clientId = "?client_id=" + process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const redirectUri = "&redirect_uri=" + encodeURIComponent(process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "");
const scopes = "&scope=" + encodeURIComponent(["user-read-private", "user-read-email"].join(" "));

const url = "https://accounts.spotify.com/authorize" + clientId + "&response_type=code" + redirectUri + scopes;

export default url;
