import React, { ReactNode } from "react";
import Head from "next/head";
import url from "../lib/getLoginUrl";
import { UserProvider, useUser } from "../contexts/UserContext";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Links = (): JSX.Element => {
  const { user } = useUser();

  return (
    <nav>
      <p>
        <a href="/">home</a>
      </p>
      {user ? (
        <>
          <p>
            <a href="/api/logout">logout</a>
          </p>
          <p>
            <a href="/protected">protected</a>
          </p>
          <p>
            <a href="/player">player</a>
          </p>
          <p>
            <a href="/playlists">playlists</a>
          </p>
        </>
      ) : (
        <p>
          <a href={url}>login</a>
        </p>
      )}
    </nav>
  );
};

export const Layout = ({ children, title = "This is the default title" }: Props): JSX.Element => {
  return (
    <UserProvider>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Links />
      {children}
    </UserProvider>
  );
};
