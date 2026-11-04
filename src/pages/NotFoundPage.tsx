import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <h1 className="text-4xl font-bold text-text-primary">404</h1>
      <p className="text-text-secondary-accessible">
        The requested page could not be found.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;
