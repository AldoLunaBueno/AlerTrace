import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'

// TODO: Reemplaza con tus credenciales de Auth0
const domain = 'dev-tcdkjdz5x5zvin5p.us.auth0.com'
const clientId = 'ZrkZH9mHL9ezZ0Xv0FLro5IGrWvreFlw'

const onRedirectCallback = (appState?: any) => {
  const target = appState?.returnTo || window.location.pathname
  window.history.replaceState({}, document.title, target)
}

createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{ redirect_uri: window.location.origin }}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>
)
