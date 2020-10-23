import { useUser } from "../contexts/UserContext";

export default function Index(): JSX.Element {
  const { user } = useUser();

  return (
    <>
      <h1>Home page</h1>
      <p>{user && user.display_name}</p>
    </>
  );
}
