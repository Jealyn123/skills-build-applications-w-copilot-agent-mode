import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/users/`
  : 'http://localhost:8000/api/users/'

function fullName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Student'
}

function initials(user) {
  return fullName(user).split(' ').map((part) => part[0]).join('').slice(0, 2)
}

export default function Users() {
  const { data, error, loading, retry } = useCollection(endpoint)
  const hasRows = !loading && !error && data.length > 0

  return (
    <section className="collection-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">THE COMMUNITY</p>
          <h1>Students</h1>
          <p className="page-subtitle">A roster of students building active routines.</p>
        </div>
        <span className="count-pill">{loading ? '...' : `${data.length} profiles`}</span>
      </header>

      <div className="table-panel">
        {!hasRows ? (
          <CollectionFeedback data={data} error={error} loading={loading} label="students" onRetry={retry} />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Student</th><th>Team</th><th>Level</th><th>Age</th><th>Handle</th></tr></thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user._id ?? user.id}>
                    <td><span className="person-cell"><span className={`avatar ${index % 2 ? 'avatar-sun' : 'avatar-mint'}`}>{initials(user)}</span><strong>{fullName(user)}</strong></span></td>
                    <td>{user.team?.name ?? (typeof user.team === 'string' ? user.team : 'Unassigned')}</td>
                    <td><span className={`level-badge level-${user.fitnessLevel}`}>{user.fitnessLevel}</span></td>
                    <td>{user.age}</td>
                    <td className="handle-cell">@{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}