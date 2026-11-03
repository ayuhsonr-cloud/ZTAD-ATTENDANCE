interface ErrorBannerProps {
  error: unknown
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Please try again.'
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null

  return (
    <div className="recovery-banner" role="alert">
      <strong>Something went wrong.</strong>
      <span>{getErrorMessage(error)}</span>
    </div>
  )
}