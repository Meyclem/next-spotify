import { NextPage } from "next";
import { useEffect } from "react";
import { SpotifyUser } from "../types/SpotifyUser";

type Props = {
  children?: JSX.Element | JSX.Element[];
  user: SpotifyUser;
  [key: string]: unknown;
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
