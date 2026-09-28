import { Link } from 'react-router-dom'
import { apiEndpoint } from '../api'
import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

function displayName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Student'
}

function dateLabel(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function SummaryStat({ label, value, note, tone }) {
  return (
    <div className={`summary-stat ${tone}`}>
      <span className="summary-label">{label}</span>
      <strong>{value}</strong>
      <span className="summary-note">{note}</span>
    </div>
  )
}

export default function Overview() {
  const users = useCollection(apiEndpoint('users'))
  const teams = useCollection(apiEndpoint('teams'))
  const activities = useCollection(apiEndpoint('activities'))
  const leaderboard = useCollection(apiEndpoint('leaderboard'))
  const isLoading = users.loading || teams.loading || activities.loading || leaderboard.loading

  return (
    <section className="overview-page">
      <header className="page-heading overview-heading">
        <div>
          <p className="eyebrow">WEEKLY PULSE / 01</p>
          <h1>Your week, in motion.</h1>
          <p className="page-subtitle">A live look at movement across Mergington High.</p>
        </div>
        <Link className="primary-action" to="/activities">View activity <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="welcome-band" aria-label="OctoFit weekly message">
        <div className="welcome-copy">
          <span className="band-kicker">OCTOFIT / SCHOOL YEAR 2026</span>
          <h2>Show up.<br />Stack small wins.</h2>
          <p>Progress is built one session at a time.</p>
        </div>
        <div className="band-stamp" aria-hidden="true"><span>MOVE</span><strong>TOGETHER</strong><span>MERGINGTON / PE</span></div>
        <span className="band-spark band-spark-one" aria-hidden="true">+</span>
        <span className="band-spark band-spark-two" aria-hidden="true">+</span>
      </section>

      <section className="summary-strip" aria-label="Program summary">
        <SummaryStat label="Students" value={isLoading ? '...' : users.data.length} note="in the program" tone="stat-green" />
        <SummaryStat label="Teams" value={isLoading ? '...' : teams.data.length} note="moving together" tone="stat-coral" />
        <SummaryStat label="Sessions" value={isLoading ? '...' : activities.data.length} note="logged this week" tone="stat-blue" />
        <SummaryStat label="Top score" value={isLoading ? '...' : `${leaderboard.data[0]?.points ?? 0}`} note="points earned" tone="stat-yellow" />
      </section>

      <div className="overview-columns">
        <section className="overview-panel">
          <div className="panel-heading"><div><p className="eyebrow">LATEST LOGS</p><h2>Recent activity</h2></div><Link to="/activities" className="quiet-link">All activity <span aria-hidden="true">↗</span></Link></div>
          {activities.loading || activities.error || activities.data.length === 0 ? (
            <CollectionFeedback data={activities.data} error={activities.error} loading={activities.loading} label="activities" onRetry={activities.retry} />
          ) : (
            <ul className="recent-list">
              {activities.data.slice(0, 4).map((activity) => (
                <li key={activity._id ?? activity.id}>
                  <span className={`activity-marker type-${activity.activityType}`} />
                  <div className="recent-copy"><strong>{displayName(activity.user)}</strong><span>{activity.activityType} / {activity.durationMinutes} min</span></div>
                  <time>{dateLabel(activity.completedAt)}</time>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="overview-panel leaders-panel">
          <div className="panel-heading"><div><p className="eyebrow">WEEKLY POINTS</p><h2>Leading the way</h2></div><Link to="/leaderboard" className="quiet-link">Full board <span aria-hidden="true">↗</span></Link></div>
          {leaderboard.loading || leaderboard.error || leaderboard.data.length === 0 ? (
            <CollectionFeedback data={leaderboard.data} error={leaderboard.error} loading={leaderboard.loading} label="leaderboard" onRetry={leaderboard.retry} />
          ) : (
            <ol className="leader-list">
              {leaderboard.data.slice(0, 3).map((entry) => (
                <li key={entry._id ?? entry.id}>
                  <span className={`leader-rank${entry.rank === 1 ? ' is-first' : ''}`}>{String(entry.rank).padStart(2, '0')}</span>
                  <span className="leader-name">{displayName(entry.user)}</span>
                  <strong>{Number(entry.points).toLocaleString()} <small>pts</small></strong>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </section>
  )
}