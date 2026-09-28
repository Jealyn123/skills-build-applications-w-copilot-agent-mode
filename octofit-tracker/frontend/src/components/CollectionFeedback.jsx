export default function CollectionFeedback({ data, error, loading, label, onRetry }) {
  if (loading) {
    return <div className="collection-feedback is-loading" role="status">Loading {label}...</div>
  }

  if (error) {
    return (
      <div className="collection-feedback is-error" role="alert">
        <div>
          <strong>Could not load {label}.</strong>
          <p>{error}</p>
        </div>
        <button className="text-button" type="button" onClick={onRetry}>Try again</button>
      </div>
    )
  }

  if (data.length === 0) {
    return <div className="collection-feedback is-empty">No {label} have been added yet.</div>
  }

  return null
}