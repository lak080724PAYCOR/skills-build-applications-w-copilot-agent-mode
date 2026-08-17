import { useMemo, useState } from 'react'

const initialState = {
  userId: '',
  type: 'running',
  durationMinutes: 30,
  distanceKm: 0,
  notes: '',
}

function ActivityForm({ users, onSubmit, isSubmitting }) {
  const students = useMemo(() => users.filter((user) => user.role === 'Student'), [users])
  const [formState, setFormState] = useState(() => ({
    ...initialState,
    userId: students[0]?.id || '',
  }))

  function updateField(event) {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit({
      ...formState,
      durationMinutes: Number(formState.durationMinutes),
      distanceKm: Number(formState.distanceKm),
    })
    setFormState((current) => ({ ...initialState, userId: current.userId || students[0]?.id || '' }))
  }

  return (
    <form className="card border-0 shadow-sm h-100" onSubmit={handleSubmit}>
      <div className="card-body">
        <h2 className="h4 mb-3">Log activity</h2>
        <div className="mb-3">
          <label className="form-label" htmlFor="activity-user">
            Student
          </label>
          <select
            id="activity-user"
            name="userId"
            className="form-select"
            value={formState.userId}
            onChange={updateField}
            required
          >
            {students.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="activity-type">
              Activity type
            </label>
            <select
              id="activity-type"
              name="type"
              className="form-select"
              value={formState.type}
              onChange={updateField}
            >
              <option value="running">Running</option>
              <option value="walking">Walking</option>
              <option value="cycling">Cycling</option>
              <option value="workout">Workout</option>
              <option value="swimming">Swimming</option>
              <option value="yoga">Yoga</option>
              <option value="basketball">Basketball</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="activity-duration">
              Duration (minutes)
            </label>
            <input
              id="activity-duration"
              type="number"
              min="1"
              name="durationMinutes"
              className="form-control"
              value={formState.durationMinutes}
              onChange={updateField}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="activity-distance">
              Distance (km)
            </label>
            <input
              id="activity-distance"
              type="number"
              min="0"
              step="0.1"
              name="distanceKm"
              className="form-control"
              value={formState.distanceKm}
              onChange={updateField}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="activity-notes">
              Notes
            </label>
            <input
              id="activity-notes"
              name="notes"
              className="form-control"
              value={formState.notes}
              onChange={updateField}
              placeholder="Optional detail"
            />
          </div>
        </div>
      </div>
      <div className="card-footer bg-white border-0 pt-0">
        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging…' : 'Log activity'}
        </button>
      </div>
    </form>
  )
}

export default ActivityForm
