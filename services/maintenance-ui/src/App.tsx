import { useContext } from 'react';
import { UserContext } from './UserContextProvider';
import { useKeycloak } from '@react-keycloak/web';
import LoginView from './LoginView';
import MainView from './MainView';

function App () {
  const user = useContext(UserContext)
  const { keycloak } = useKeycloak()

  let content: JSX.Element

  if (user.loggedIn) {
    console.log('MainView')
    // Let the user know they're logged in, but we need to load products
    content = <MainView token={user.token} />
  } else {
    console.log('Login')
    // Render the fetched products list
    content = <LoginView/>
  }

  return (
    <div className="max-w-screen-lg px-8 pt-6 mx-auto">
      <header className="flex w-full items-center pb-3 border-b border-blue-300">
        <div className="flex">
          <img className="h-12 w-12 p-2 inline-block" src="parking-meter.png" alt="parking meter icon" />
          <h2 className="text-2xl p-2">
            Parking Maintenance System
          </h2>
        </div>
        <div className="flex-1"></div>
        {
          user?.loggedIn ?
          <button className="font-semibold hover:text-white hover:bg-red-500 py-2 px-4 rounded" onClick={() => keycloak.logout()}>Logout</button> :
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => keycloak.login()}>Login</button>
        }
      </header>
      {content}
    </div>
  )
}

export default App;
