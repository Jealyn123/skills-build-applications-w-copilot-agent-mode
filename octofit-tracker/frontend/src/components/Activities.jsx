import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/'

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Student'
}

function dateLabel(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Activities() {
  const { data, error, loading, retry } = useCollection(endpoint)
  const hasRows = !loading && !error && data.length > 0

  return (
    <section className="collection-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">MOVEMENT LOG</p>
          <h1>Activities</h1>
          <p className="page-subtitle">Every run, walk, and strength session in one place.</p>
        </div>
        <span className="count-pill">{loading ? '...' : `${data.length} sessions`}</span>
      </header>

      <div className="table-panel">
        {!hasRows ? (
          <CollectionFeedback data={data} error={error} loading={loading} label="activities" onRetry={retry} />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Student</th><th>Activity</th><th>Completed</th><th>Duration</th><th>Energy</th></tr></thead>
              <tbody>
                {data.map((activity) => (
                  <tr key={activity._id ?? activity.id}>
                    <td><span className="person-cell"><span className="avatar avatar-coral">{fullName(activity.user).split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><strong>{fullName(activity.user)}</strong></span></td>
                    <td><span className={`activity-type type-${activity.activityType}`}>{activity.activityType}</span></td>
                    <td>{dateLabel(activity.completedAt)}</td>
                    <td>{activity.durationMinutes} min</td>
                    <td>{activity.caloriesBurned} kcal</td>
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