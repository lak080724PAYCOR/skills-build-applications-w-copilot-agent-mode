import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/AppLayout.jsx'
import ActivityForm from './components/forms/ActivityForm.jsx'
import ProfileForm from './components/forms/ProfileForm.jsx'
import TeamManagementForm from './components/forms/TeamManagementForm.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import LeaderboardsPage from './pages/LeaderboardsPage.jsx'
import TeamsPage from './pages/TeamsPage.jsx'
import { createTeam, createUser, fetchBootstrapData, joinTeam, logActivity } from './services/api.js'

function App() {
  const [dashboard, setDashboard] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadDashboard = useCallback(async () => {
    try {
      const payload = await fetchBootstrapData()
      setDashboard(payload)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message)
    }
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const handleRequest = useCallback(
    async (requestHandler, successMessage) => {
      setIsSubmitting(true)
      setStatusMessage('')
      setErrorMessage('')

      try {
        await requestHandler()
        await loadDashboard()
        setStatusMessage(successMessage)
      } catch (error) {
        setErrorMessage(error.message)
      } finally {
        setIsSubmitting(false)
      }
    },
    [loadDashboard],
  )

  if (!dashboard) {
    return (
      <main className="app-shell d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-info mb-3" role="status" />
          <p className="mb-0 text-secondary">Loading OctoFit Tracker…</p>
        </div>
      </main>
    )
  }

  return (
    <BrowserRouter>
      <AppLayout summary={dashboard.summary} statusMessage={statusMessage} errorMessage={errorMessage}>
        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                dashboard={dashboard}
                isSubmitting={isSubmitting}
                profileForm={
                  <ProfileForm
                    isSubmitting={isSubmitting}
                    onSubmit={(payload) =>
                      handleRequest(() => createUser(payload), `${payload.name} joined OctoFit Tracker.`)
                    }
                  />
                }
                activityForm={
                  <ActivityForm
                    users={dashboard.users}
                    isSubmitting={isSubmitting}
                    onSubmit={(payload) =>
                      handleRequest(() => logActivity(payload), 'Activity logged and leaderboards refreshed.')
                    }
                  />
                }
              />
            }
          />
          <Route
            path="/teams"
            element={
              <TeamsPage
                dashboard={dashboard}
                isSubmitting={isSubmitting}
                teamForm={
                  <TeamManagementForm
                    teams={dashboard.teams}
                    users={dashboard.users}
                    isSubmitting={isSubmitting}
                    onCreateTeam={(payload) =>
                      handleRequest(() => createTeam(payload), `${payload.name} is ready for new members.`)
                    }
                    onJoinTeam={(payload) =>
                      handleRequest(
                        () => joinTeam(payload.teamId, payload.userId),
                        'Team membership updated successfully.',
                      )
                    }
                  />
                }
              />
            }
          />
          <Route path="/leaderboards" element={<LeaderboardsPage dashboard={dashboard} />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
