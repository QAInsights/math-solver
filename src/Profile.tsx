import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated &&
    user && (
      <div className="profile-container">
        <img src={user.picture} alt={user.name} className="profile-picture" />
        <p>{user.name}</p>
      </div>
    )
  );
};
export default Profile;
