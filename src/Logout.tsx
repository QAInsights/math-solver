import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'react-bootstrap';

const LogoutButton = () => {
  const { isAuthenticated, logout } = useAuth0();

  return (
    isAuthenticated && (
      <Button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </Button>
    )
  );
};

export default LogoutButton;
