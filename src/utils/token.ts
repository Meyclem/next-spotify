import Cookies from "cookies";
import { GetServerSidePropsContext, NextPageContext } from "next";

export function getAccessToken(context: GetServerSidePropsContext | NextPageContext): string | undefined {
  if (context.req && context.res) {
    const cookies = new Cookies(context.req, context.res);

    const cookie = cookies.get("spot-next") || "";

    if (cookie && typeof cookie === "string") {
      return cookie;
    }
  }
}
