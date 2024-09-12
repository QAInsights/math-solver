import { useAuth0 } from "@auth0/auth0-react";

export const useAuth0Backend = () => {
  const { getAccessTokenSilently, ...auth0 } = useAuth0();

  const getBackendToken = async () => {
    return await getAccessTokenSilently({
      audience: "https://nodejs-serverless-function-express-seven-beige.vercel.app/"    } as any); // Type assertion to bypass type error
  };

  return { ...auth0, getBackendToken };
};