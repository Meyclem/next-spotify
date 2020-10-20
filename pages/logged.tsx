// import { GetServerSideProps } from "next";
import { UserContext } from "../contexts/UserContext";
import withAuth, { SpotifyUser } from "../components/WithAuth";
import { NextPage } from "next";

interface Props {
  user?: SpotifyUser;
}

// import * as cookies from "../utils/cookies";
const Logged: NextPage<Props> = () => {
  return (
    <UserContext.Consumer>
      {(user): JSX.Element => {
        console.log({ user });
        return user && <p>Hello: {user.display_name}</p>;
      }}
    </UserContext.Consumer>
  );
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

export default withAuth(Logged);
