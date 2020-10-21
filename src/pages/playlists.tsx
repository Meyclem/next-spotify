// import { GetServerSideProps } from "next";
import withAuth, { SpotifyUser } from "../components/WithAuth";
import { NextPage } from "next";

interface Props {
  user?: SpotifyUser;
}

// import * as cookies from "../utils/cookies";
const Playlists: NextPage<Props> = () => {
  return <p>Playlists</p>;
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const token = cookies.get(context, "access_token");
//   console.log({ token });
//   // const { access_token } = cookie;
//   // console.log(access_token);
//   return {
//     props: {}, // will be passed to the page component as props
//   };
// };

export default withAuth(Playlists);
