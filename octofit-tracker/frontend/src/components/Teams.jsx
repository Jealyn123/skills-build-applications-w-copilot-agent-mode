import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/'

function memberName(member) {
  if (typeof member === 'string') return member
  return [member?.firstName, member?.lastName].filter(Boolean).join(' ') || member?.username || 'Student'
}

export default function Teams() {
  const { data, error, loading, retry } = useCollection(endpoint)
  const hasRows = !loading && !error && data.length > 0

  return (
    <section className="collection-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">MOVE TOGETHER</p>
          <h1>Teams</h1>
          <p className="page-subtitle">Shared goals make good habits easier to keep.</p>
        </div>
        <span className="count-pill">{loading ? '...' : `${data.length} teams`}</span>
      </header>

      {!hasRows ? (
        <div className="table-panel"><CollectionFeedback data={data} error={error} loading={loading} label="teams" onRetry={retry} /></div>
      ) : (
        <div className="team-grid">
          {data.map((team, index) => (
            <article className={`team-card team-card-${index % 2}`} key={team._id ?? team.id}>
              <div className="team-card-top"><span className="team-index">TEAM / {String(index + 1).padStart(2, '0')}</span><span className="member-count">{team.members?.length ?? 0} members</span></div>
              <h2>{team.name}</h2>
              <p className="team-description">{team.description}</p>
              <div className="team-divider" />
              <p className="member-label">ROSTER</p>
              <ul className="member-list">
                {(team.members ?? []).map((member, memberIndex) => (
                  <li key={member._id ?? member.id ?? `${team._id}-${memberIndex}`}>
                    <span className={`avatar ${memberIndex % 2 ? 'avatar-sun' : 'avatar-mint'}`}>{memberName(member).split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
                    <span>{memberName(member)}</span>
                  </li>
                ))}
              </ul>
              {team.members?.length === 0 && <p className="no-members">Roster is ready for its first member.</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}