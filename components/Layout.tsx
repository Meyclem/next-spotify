import React, { ReactNode } from "react";
import Head from "next/head";
import url from "../lib/getLoginUrl";

type Props = {
  children?: ReactNode;
  title?: string;
};

export const Layout = ({ children, title = "This is the default title" }: Props): JSX.Element => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <nav>
        <p>
          <a href="/">home</a>
        </p>
        <p>
          <a href={url}>login</a>
        </p>
      </nav>
      {children}
      <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
      </footer>
    </>
  );
};
