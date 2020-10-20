import Cookies from "cookies";
import fetch from "isomorphic-unfetch";
import { getAccessToken } from "../utils/token";
import { NextPage, NextPageContext } from "next";
import { UserContext } from "../contexts/UserContext";
import { useEffect } from "react";
import Router from "next/router";

type Props = {
  children?: JSX.Element | JSX.Element[];
  user?: SpotifyUser;
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
  const FuncComponent = ({ children, user, ...props }: Props): JSX.Element => {
    useEffect(() => {
      if (!user) {
        Router.push("/");
      }
    });
    if (user) {
      return (
        <UserContext.Provider value={user}>
          <WrappedComponent {...props}>{children}</WrappedComponent>
        </UserContext.Provider>
      );
    } else {
      return (
        <>
          <p>Authentication Error</p>
        </>
      );
    }
  };

  FuncComponent.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
    const props = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    if (ctx && ctx.req && ctx.res) {
      const cookies = new Cookies(ctx.req, ctx.res);
      if (cookies.get("spot-next")) {
        const token = getAccessToken(ctx);
        const user: SpotifyUser = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(async (res) => await res.json());

        return { ...props, user };
      }
    }
    return { ...props };
  };

  return FuncComponent;
};

export default withAuth;
