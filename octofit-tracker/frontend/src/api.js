const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function apiEndpoint(resource) {
  return `${API_BASE_URL}/api/${resource}/`
}

export async function fetchCollection(endpoint, signal) {
  const response = await fetch(endpoint, { signal })

  if (!response.ok) {
    throw new Error(`The request failed with status ${response.status}.`)
  }

  const payload = await response.json()

  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.items)) return payload.items

  throw new Error('The API returned an unsupported collection response.')
}