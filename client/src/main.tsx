import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles.scss'
import { BrowserRouter } from 'react-router-dom'
import { ApiContextProvider, ProjectsDataContextProvider, UserDataContextProvider, SidebarContextProvider, ThemeContextProvider } from './components/Contexts'

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  // <React.StrictMode>
  <BrowserRouter>
    <ApiContextProvider>
      <UserDataContextProvider>
        <ProjectsDataContextProvider>
          <SidebarContextProvider>
            <ThemeContextProvider>
              <App />
            </ThemeContextProvider>
          </SidebarContextProvider>
        </ProjectsDataContextProvider>
      </UserDataContextProvider>
    </ApiContextProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
