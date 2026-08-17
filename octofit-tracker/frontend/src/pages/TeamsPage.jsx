function TeamsPage({ dashboard, teamForm }) {
  return (
    <div className="vstack gap-4">
      {teamForm}
      <section className="row g-4">
        {dashboard.teams.map((team) => (
          <div className="col-xl-4 col-md-6" key={team.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="h4 mb-1">{team.name}</h2>
                    <p className="text-secondary mb-0">{team.description}</p>
                  </div>
                  <span className="badge text-bg-info">{team.totalPoints} pts</span>
                </div>
                <dl className="row mb-3">
                  <dt className="col-6 text-secondary">Members</dt>
                  <dd className="col-6 text-end">{team.members.length}</dd>
                  <dt className="col-6 text-secondary">Minutes logged</dt>
                  <dd className="col-6 text-end">{team.totalDurationMinutes}</dd>
                  <dt className="col-6 text-secondary">Teacher sponsor</dt>
                  <dd className="col-6 text-end">{team.teachers.map((teacher) => teacher.name).join(', ')}</dd>
                </dl>
                <h3 className="h6 mt-auto">Roster</h3>
                <ul className="list-unstyled mb-0 small">
                  {team.members.map((member) => (
                    <li className="py-1 border-bottom" key={member.id}>
                      {member.name} • {member.totalPoints} pts
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default TeamsPage
