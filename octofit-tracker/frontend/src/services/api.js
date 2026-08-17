const codespaceName = import.meta.env.VITE_CODESPACE_NAME
const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (codespaceName ? `https://${codespaceName}-8000.app.github.dev/api` : 'http://localhost:8000/api')

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ message: 'Request failed.' }))
    throw new Error(payload.message || 'Request failed.')
  }

  return response.json()
}

export function fetchBootstrapData() {
  return request('/bootstrap')
}

export function createUser(payload) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function logActivity(payload) {
  return request('/activities', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createTeam(payload) {
  return request('/teams', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function joinTeam(teamId, userId) {
  return request(`/teams/${teamId}/join`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  })
}
