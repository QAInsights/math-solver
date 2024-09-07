import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Auth0Provider } from "@auth0/auth0-react";
import process from "process";

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={process.env.OAUTH_DOMAIN as string}
    clientId={process.env.OAUTH_CLIENT_ID as string}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
  </Auth0Provider>
);
