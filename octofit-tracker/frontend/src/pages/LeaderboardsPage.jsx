function LeaderboardsPage({ dashboard }) {
  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h2 className="h4 mb-3">Individual leaderboard</h2>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Student</th>
                    <th className="text-end">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.individualLeaderboard.map((entry) => (
                    <tr key={entry.entityId}>
                      <td>#{entry.rank}</td>
                      <td>{entry.name}</td>
                      <td className="text-end fw-semibold">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-6">
        <div className="card border-0 shadow-sm h-100">
          <div className="card-body">
            <h2 className="h4 mb-3">Team leaderboard</h2>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th className="text-end">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.teamLeaderboard.map((entry) => (
                    <tr key={entry.entityId}>
                      <td>#{entry.rank}</td>
                      <td>{entry.name}</td>
                      <td className="text-end fw-semibold">{entry.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardsPage
