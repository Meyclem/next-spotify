import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "cookies";

export default async (request: NextApiRequest, response: NextApiResponse): Promise<void> => {
  const code = request.query.code as string;

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "");

  const base64Keys = new Buffer(
    `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64Keys}`,
    },
    body: params,
  });
  const body = await res.json();

  const { access_token } = body;

  const cookies = new Cookies(request, response);

  cookies.set("spot-next", access_token, {
    maxAge: 3600000,
    httpOnly: false,
    path: "/",
  });

  response.redirect("/protected");
};
