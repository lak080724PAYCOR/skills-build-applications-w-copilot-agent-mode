import { useMemo, useState } from 'react'

function TeamManagementForm({ teams, users, onCreateTeam, onJoinTeam, isSubmitting }) {
  const students = useMemo(() => users.filter((user) => user.role === 'Student'), [users])
  const teachers = useMemo(() => users.filter((user) => user.role === 'Gym Teacher'), [users])

  const [teamState, setTeamState] = useState({
    name: '',
    description: '',
    captainId: students[0]?.id || '',
    teacherIds: teachers[0] ? [teachers[0].id] : [],
  })
  const [joinState, setJoinState] = useState({
    teamId: teams[0]?.id || '',
    userId: students[0]?.id || '',
  })

  function updateTeamField(event) {
    const { name, value } = event.target
    setTeamState((current) => ({ ...current, [name]: value }))
  }

  function updateJoinField(event) {
    const { name, value } = event.target
    setJoinState((current) => ({ ...current, [name]: value }))
  }

  async function handleCreateTeam(event) {
    event.preventDefault()
    await onCreateTeam(teamState)
    setTeamState((current) => ({ ...current, name: '', description: '' }))
  }

  async function handleJoinTeam(event) {
    event.preventDefault()
    await onJoinTeam(joinState)
  }

  return (
    <div className="row g-4">
      <div className="col-lg-6">
        <form className="card border-0 shadow-sm h-100" onSubmit={handleCreateTeam}>
          <div className="card-body">
            <h2 className="h4 mb-3">Create team</h2>
            <div className="mb-3">
              <label className="form-label" htmlFor="team-name">
                Team name
              </label>
              <input
                id="team-name"
                name="name"
                className="form-control"
                value={teamState.name}
                onChange={updateTeamField}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="team-description">
                Description
              </label>
              <textarea
                id="team-description"
                name="description"
                className="form-control"
                rows="3"
                value={teamState.description}
                onChange={updateTeamField}
                required
              />
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="team-captain">
                  Captain
                </label>
                <select
                  id="team-captain"
                  name="captainId"
                  className="form-select"
                  value={teamState.captainId}
                  onChange={updateTeamField}
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="team-teacher">
                  Teacher sponsor
                </label>
                <select
                  id="team-teacher"
                  className="form-select"
                  value={teamState.teacherIds[0] || ''}
                  onChange={(event) =>
                    setTeamState((current) => ({ ...current, teacherIds: [event.target.value] }))
                  }
                >
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="card-footer bg-white border-0 pt-0">
            <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Create team'}
            </button>
          </div>
        </form>
      </div>

      <div className="col-lg-6">
        <form className="card border-0 shadow-sm h-100" onSubmit={handleJoinTeam}>
          <div className="card-body">
            <h2 className="h4 mb-3">Join team</h2>
            <div className="mb-3">
              <label className="form-label" htmlFor="join-student">
                Student
              </label>
              <select
                id="join-student"
                name="userId"
                className="form-select"
                value={joinState.userId}
                onChange={updateJoinField}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="join-team">
                Team
              </label>
              <select
                id="join-team"
                name="teamId"
                className="form-select"
                value={joinState.teamId}
                onChange={updateJoinField}
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-secondary small mb-0">
              Students can join multiple clubs while teachers track progress across every group.
            </p>
          </div>
          <div className="card-footer bg-white border-0 pt-0">
            <button className="btn btn-outline-primary w-100" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating…' : 'Add student to team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TeamManagementForm
