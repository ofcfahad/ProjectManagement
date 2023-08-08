import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './styles.scss'
import { BrowserRouter } from 'react-router-dom'
import ProjectsDataContextProvider from './components/Contexts/Project/ProjectsDataContext'
import GuestContextProvider from './components/Contexts/User/GuestContext'
import UserDataContextProvider from './components/Contexts/User/UserDataContext'
import SidebarContextProvider from './components/Contexts/SideBar/SidebarContext'
import ThemeContextProvider from './components/Contexts/Theme/ThemeContext'

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  // <React.StrictMode>
  <BrowserRouter>
    <GuestContextProvider>
      <UserDataContextProvider>
        <ProjectsDataContextProvider>
          <SidebarContextProvider>
            <ThemeContextProvider>
              <App />
            </ThemeContextProvider>
          </SidebarContextProvider>
        </ProjectsDataContextProvider>
      </UserDataContextProvider>
    </GuestContextProvider>
  </BrowserRouter>
  // </React.StrictMode>
)
