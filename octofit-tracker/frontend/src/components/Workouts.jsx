import CollectionFeedback from './CollectionFeedback.jsx'
import useCollection from '../hooks/useCollection.js'

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
const endpoint = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
  : 'http://localhost:8000/api/workouts/'

export default function Workouts() {
  const { data, error, loading, retry } = useCollection(endpoint)
  const hasRows = !loading && !error && data.length > 0

  return (
    <section className="collection-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">IDEAS FOR YOUR NEXT SESSION</p>
          <h1>Workouts</h1>
          <p className="page-subtitle">A few good ways to get moving, at every level.</p>
        </div>
        <span className="count-pill">{loading ? '...' : `${data.length} sessions`}</span>
      </header>

      {!hasRows ? (
        <div className="table-panel"><CollectionFeedback data={data} error={error} loading={loading} label="workouts" onRetry={retry} /></div>
      ) : (
        <div className="workout-grid">
          {data.map((workout, index) => (
            <article className={`workout-card workout-card-${index % 3}`} key={workout._id ?? workout.id}>
              <div className="workout-card-top"><span className={`activity-type type-${workout.activityType}`}>{workout.activityType}</span><span className="workout-duration">{workout.durationMinutes} MIN</span></div>
              <h2>{workout.title}</h2>
              <p>{workout.description}</p>
              <div className="workout-card-bottom"><span className={`level-badge level-${workout.targetFitnessLevel}`}>{workout.targetFitnessLevel}</span><span className="intensity-label">{workout.intensity} effort</span></div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}