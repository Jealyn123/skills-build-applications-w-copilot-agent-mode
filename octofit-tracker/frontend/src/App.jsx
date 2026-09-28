import { NavLink, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Overview from './components/Overview.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './theme.css'

const navigation = [
  { to: '/', label: 'Overview', mark: '01', end: true },
  { to: '/activities', label: 'Activities', mark: '02' },
  { to: '/leaderboard', label: 'Leaderboard', mark: '03' },
  { to: '/teams', label: 'Teams', mark: '04' },
  { to: '/users', label: 'Students', mark: '05' },
  { to: '/workouts', label: 'Workouts', mark: '06' },
]

function ApplicationShell() {
  const location = useLocation()
  const currentPage = navigation.find((item) => item.to === location.pathname)

  return (
    <div className="application-shell">
      <aside className="sidebar">
        <NavLink className="brand-lockup" to="/" aria-label="OctoFit Tracker overview">
          <img src={octofitLogo} alt="" className="brand-logo" />
          <span className="brand-copy">
            <strong>OctoFit</strong>
            <small>TRACKER / MERGINGTON</small>
          </span>
        </NavLink>

        <p className="nav-caption">YOUR PROGRAM</p>
        <nav className="side-navigation" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `side-link${isActive ? ' is-active' : ''}`}
            >
              <span className="side-link-mark">{item.mark}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="season-chip">FALL / 2026</span>
          <p>Small moves add up.</p>
        </div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>MERGINGTON HIGH</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{currentPage?.label ?? 'OctoFit'}</strong>
          </div>
          <div className="topbar-meta">
            <span className="today-label">WEEKLY VIEW</span>
            <span className="program-badge"><span /> PE PROGRAM</span>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<ApplicationShell />}>
        <Route index element={<Overview />} />
        <Route path="activities" element={<Activities />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="teams" element={<Teams />} />
        <Route path="users" element={<Users />} />
        <Route path="workouts" element={<Workouts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
