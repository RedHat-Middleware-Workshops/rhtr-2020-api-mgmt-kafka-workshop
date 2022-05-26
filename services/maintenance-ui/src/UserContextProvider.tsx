import { useKeycloak } from '@react-keycloak/web';
import { KeycloakProfile } from 'keycloak-js';
import React, { useEffect, useState } from 'react'

export type UserStateLoggedOut = { loggedIn: false }
export type UserStateLoggedIn = {
  profile: KeycloakProfile;
  token: string;
  loggedIn: true;
}
export type UserState = UserStateLoggedOut|UserStateLoggedIn

export const UserContext = React.createContext<UserState>({
  loggedIn: false
});

const UserContextProdiver: React.FunctionComponent = (props) => {
  const { keycloak, initialized } = useKeycloak()
  const [ ctx, setCtx ] = useState<UserState>({
    loggedIn: false
  })

  // I guess this is a little hacky? Wait for keycloak to be initialised, then
  // fetch the user profile details. Technically many of the same details are
  // embedded directly in the JWT (keycloak.token property), but aren't
  // strongly typed so maybe shouldn't be relied upon? This is fine anyways...
  useEffect(() => {
    const fetchProfile = () => {
      keycloak.loadUserProfile()
      .then((profile) => setCtx({ profile, loggedIn: true, token: keycloak.token as string }))
      .catch((e) => alert(`Failed to fetch user profile: ${e}`))
    }

    if (initialized && keycloak.token) {
      fetchProfile()
    }
  }, [keycloak, initialized]);

  return (
    <UserContext.Provider value={ctx}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProdiver;
