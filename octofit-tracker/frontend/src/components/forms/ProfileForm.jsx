import { useState } from 'react'

const initialState = {
  name: '',
  role: 'Student',
  grade: '',
  favoriteActivity: 'running',
}

function ProfileForm({ onSubmit, isSubmitting }) {
  const [formState, setFormState] = useState(initialState)

  function updateField(event) {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    await onSubmit(formState)
    setFormState(initialState)
  }

  return (
    <form className="card border-0 shadow-sm h-100" onSubmit={handleSubmit}>
      <div className="card-body">
        <h2 className="h4 mb-3">Create profile</h2>
        <div className="mb-3">
          <label className="form-label" htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            className="form-control"
            value={formState.name}
            onChange={updateField}
            placeholder="Student or teacher name"
            required
          />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="profile-role">
              Role
            </label>
            <select
              id="profile-role"
              name="role"
              className="form-select"
              value={formState.role}
              onChange={updateField}
            >
              <option>Student</option>
              <option>Gym Teacher</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="profile-grade">
              Grade
            </label>
            <input
              id="profile-grade"
              name="grade"
              className="form-control"
              value={formState.grade}
              onChange={updateField}
              placeholder="9-12 for students"
              disabled={formState.role === 'Gym Teacher'}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="form-label" htmlFor="profile-favorite">
            Favorite activity
          </label>
          <select
            id="profile-favorite"
            name="favoriteActivity"
            className="form-select"
            value={formState.favoriteActivity}
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
      </div>
      <div className="card-footer bg-white border-0 pt-0">
        <button className="btn btn-primary w-100" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Create profile'}
        </button>
      </div>
    </form>
  )
}

export default ProfileForm
