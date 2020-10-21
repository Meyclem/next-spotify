// import Cookies from "cookies";
// import { getAccessToken } from "../utils/token";
import { NextPage } from "next";
// import { UserContext, useUserDispatchContext } from "../contexts/UserContext";
// import { IncomingMessage, ServerResponse } from "http";
import { useEffect } from "react";
// import { stringify } from "querystring";

type Props = {
  children?: JSX.Element | JSX.Element[];
  user: SpotifyUser;
  [key: string]: unknown;
};

export type SpotifyUser = {
  display_name: string;
  email: string;
  explicit_content: Record<string, unknown>;
  external_urls: Record<string, unknown>;
  followers: Record<string, unknown>;
  href: string;
  id: string;
  images: Record<string, unknown>[];
  product: string;
  type: string;
  uri: string;
};

const withAuth = (WrappedComponent: NextPage): React.FunctionComponent<Props> => {
  const FuncComponent = ({ children, ...props }: Props): JSX.Element => {
    useEffect(() => {
      document.cookie ? console.log("🍪") : console.log("🚫🍪");
      const cookies = document.cookie
        .split("; ")
        .map((stringifyCookie) => {
          const [key, value] = stringifyCookie.split("=");
          const cookie: Record<string, string> = {};
          cookie[key] = value;
          return cookie;
        })
        .reduce((previous, current) => {
          return { ...previous, ...current };
        });
      console.log(cookies["spot-next"]);
      if (!cookies["spot-next"]) {
        window.location.replace("/login");
      }
    });
    return <WrappedComponent {...props}>{children}</WrappedComponent>;
  };

  // FuncComponent.getInitialProps = async ({
  //   req,
  //   res,
  // }: {
  //   req: IncomingMessage;
  //   res: ServerResponse;
  // }): Promise<unknown> => {
  //   const ctx = { res, req } as NextPageContext;
  //   // FuncComponent.getInitialProps = async (ctx: NextPageContext): Promise<Props | undefined> => {
  //   const props = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

  //   const cookies = new Cookies(req, res);
  //   if (cookies.get("spot-next")) {
  //     const token = getAccessToken(ctx);
  //     const user: SpotifyUser = await fetch("https://api.spotify.com/v1/me", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }).then(async (res) => await res.json());

  //     return { ...props, user };
  //   }
  //   res.setHeader("location", "/login");
  //   res.statusCode = 307;
  //   res.end();
  // };

  return FuncComponent;
};

export default withAuth;
