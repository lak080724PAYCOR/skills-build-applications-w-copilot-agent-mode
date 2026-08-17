import StatCard from '../components/StatCard.jsx'

function DashboardPage({ dashboard, profileForm, activityForm }) {
  const students = dashboard.users.filter((user) => user.role === 'Student')
  const teachers = dashboard.users.filter((user) => user.role === 'Gym Teacher')

  return (
    <div className="vstack gap-4">
      <section className="row g-3">
        <StatCard
          label="Students"
          value={students.length}
          hint="Students earning points through daily movement."
        />
        <StatCard label="Teachers" value={teachers.length} hint="Gym teachers guiding teams and challenges." />
        <StatCard
          label="Recent activities"
          value={dashboard.activities.slice(0, 5).length}
          hint="Latest submissions powering the live leaderboards."
        />
        <StatCard
          label="Top student"
          value={dashboard.individualLeaderboard[0]?.name || '—'}
          hint={`${dashboard.individualLeaderboard[0]?.points || 0} points earned so far.`}
        />
      </section>

      <section className="row g-4">
        <div className="col-xl-6">{profileForm}</div>
        <div className="col-xl-6">{activityForm}</div>
      </section>

      <section className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">Student progress</h2>
                <span className="text-secondary small">Cumulative points and suggestions</span>
              </div>
              <div className="row g-3">
                {students.map((student) => {
                  const lastPoint = student.progress.at(-1)?.cumulativePoints || 0

                  return (
                    <div className="col-md-6" key={student.id}>
                      <div className="student-card border rounded-4 p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h3 className="h5 mb-1">{student.name}</h3>
                            <p className="text-secondary mb-0">
                              Grade {student.grade} • {student.favoriteActivity}
                            </p>
                          </div>
                          <span className="badge text-bg-primary">{student.totalPoints} pts</span>
                        </div>
                        <p className="small text-secondary mb-2">
                          {student.totalDurationMinutes} minutes logged • {student.totalDistanceKm} km tracked
                        </p>
                        <div className="progress mb-3" role="progressbar" aria-label={`${student.name} progress`}>
                          <div
                            className="progress-bar bg-info"
                            style={{ width: `${Math.min(100, Math.max(15, lastPoint / 5))}%` }}
                          />
                        </div>
                        <ul className="list-unstyled small mb-0">
                          {student.suggestions.map((suggestion) => (
                            <li className="mb-2" key={`${student.id}-${suggestion.title}`}>
                              <strong>{suggestion.title}:</strong> {suggestion.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="h4 mb-3">Recent activity feed</h2>
              <div className="list-group list-group-flush">
                {dashboard.activities.slice(0, 8).map((activity) => {
                  const student = dashboard.users.find((user) => user.id === activity.userId)

                  return (
                    <div className="list-group-item px-0" key={activity.id}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h3 className="h6 mb-1">{student?.name || 'Unknown student'}</h3>
                          <p className="text-secondary mb-1 text-capitalize">
                            {activity.type} • {activity.durationMinutes} min • {activity.distanceKm} km
                          </p>
                          <p className="small mb-0">{activity.notes || 'Activity logged without a note.'}</p>
                        </div>
                        <span className="badge text-bg-light">{activity.points} pts</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
