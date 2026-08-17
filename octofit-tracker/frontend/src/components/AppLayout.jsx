import { NavLink } from 'react-router-dom'
import logo from '../../../../docs/octofitapp-small.png'

function AppLayout({ children, summary, statusMessage, errorMessage }) {
  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg octofit-navbar shadow-sm">
        <div className="container py-2">
          <NavLink className="navbar-brand d-flex align-items-center gap-3 text-white fw-semibold" to="/">
            <img src={logo} alt="OctoFit Tracker" className="app-logo" />
            <span>OctoFit Tracker</span>
          </NavLink>
          <div className="navbar-nav ms-auto flex-row gap-3">
            <NavLink className="nav-link text-white" to="/">
              Dashboard
            </NavLink>
            <NavLink className="nav-link text-white" to="/teams">
              Teams
            </NavLink>
            <NavLink className="nav-link text-white" to="/leaderboards">
              Leaderboards
            </NavLink>
          </div>
        </div>
      </nav>

      <header className="hero-banner">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <span className="badge rounded-pill text-bg-info mb-3">Mergington High prototype</span>
              <h1 className="display-5 fw-bold text-white mb-3">
                Move together, earn points, and build healthy routines.
              </h1>
              <p className="lead text-white-50 mb-0">
                OctoFit Tracker helps students and gym teachers log workouts, monitor progress, and
                celebrate team-based fitness challenges.
              </p>
            </div>
            <div className="col-lg-4">
              <div className="hero-summary card border-0 shadow">
                <div className="card-body">
                  <h2 className="h5 mb-3">Today&apos;s snapshot</h2>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Profiles</span>
                    <strong>{summary.totalUsers}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Activities</span>
                    <strong>{summary.totalActivities}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span>Teams</span>
                    <strong>{summary.totalTeams}</strong>
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    <span>School points</span>
                    <strong>{summary.schoolPoints}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        {statusMessage ? <div className="alert alert-success">{statusMessage}</div> : null}
        {errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null}
        {children}
      </main>
    </div>
  )
}

export default AppLayout
