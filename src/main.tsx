import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Auth0Provider } from "@auth0/auth0-react";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={import.meta.env.VITE_OAUTH_DOMAIN}
    clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
