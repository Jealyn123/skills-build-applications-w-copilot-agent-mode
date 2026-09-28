import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/'

function fullName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Student'
}

export default function Leaderboard() {
  const { data, error, loading, retry } = useCollection(endpoint)
  const hasRows = !loading && !error && data.length > 0

  return (
    <section className="collection-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">FRIENDLY COMPETITION</p>
          <h1>Leaderboard</h1>
          <p className="page-subtitle">Consistency earns points. Every effort counts.</p>
        </div>
        <span className="count-pill">WEEKLY</span>
      </header>

      <div className="leaderboard-panel">
        {!hasRows ? (
          <CollectionFeedback data={data} error={error} loading={loading} label="leaderboard entries" onRetry={retry} />
        ) : (
          <div className="table-responsive">
            <table className="data-table leaderboard-table">
              <thead><tr><th>Rank</th><th>Student</th><th>Period</th><th className="numeric-cell">Points</th></tr></thead>
              <tbody>
                {data.map((entry) => (
                  <tr key={entry._id ?? entry.id} className={entry.rank === 1 ? 'top-rank' : ''}>
                    <td><span className={`rank-number${entry.rank === 1 ? ' rank-first' : ''}`}>{String(entry.rank).padStart(2, '0')}</span></td>
                    <td><span className="person-cell"><span className="avatar avatar-green">{fullName(entry.user).split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><strong>{fullName(entry.user)}</strong></span></td>
                    <td><span className="period-label">{entry.period}</span></td>
                    <td className="numeric-cell"><strong className="points-value">{Number(entry.points).toLocaleString()}</strong><span className="points-unit"> pts</span></td>
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