# Frontend API configuration

The frontend uses `http://localhost:8000` when `VITE_CODESPACE_NAME` is unset.

In a GitHub Codespace, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` using the Codespace name only, without the port or domain:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Restart Vite after changing `.env.local`. The app then requests the API at `https://<VITE_CODESPACE_NAME>-8000.app.github.dev`.

Collection views accept plain arrays and paginated responses containing `results`, `data`, or `items` arrays.