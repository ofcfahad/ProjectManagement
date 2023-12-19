import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles.scss'
import { BrowserRouter } from 'react-router-dom'
import { ApiContextProvider, ProjectsDataContextProvider, UserDataContextProvider, SidebarContextProvider, ThemeContextProvider, ChatsContextProvider } from './components/Contexts'

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ApiContextProvider>
      <UserDataContextProvider>
        <ProjectsDataContextProvider>
          <ChatsContextProvider>
            <SidebarContextProvider>
              <ThemeContextProvider>
                <App />
              </ThemeContextProvider>
            </SidebarContextProvider>
          </ChatsContextProvider>
        </ProjectsDataContextProvider>
      </UserDataContextProvider>
    </ApiContextProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
