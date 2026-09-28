import { useEffect, useState } from 'react'
import { fetchCollection } from '../api'

export default function useCollection(endpoint) {
  const [refreshCount, setRefreshCount] = useState(0)
  const [state, setState] = useState({ data: [], error: '', loading: true })

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    fetchCollection(endpoint, controller.signal)
      .then((data) => {
        if (active) setState({ data, error: '', loading: false })
      })
      .catch((error) => {
        if (active && error.name !== 'AbortError') {
          setState({ data: [], error: error.message, loading: false })
        }
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [endpoint, refreshCount])

  return {
    ...state,
    retry: () => {
      setState((current) => ({ ...current, error: '', loading: true }))
      setRefreshCount((count) => count + 1)
    },
  }
}