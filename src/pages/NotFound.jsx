import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="rounded-xl bg-white border border-slate-200 shadow-card p-8">
      <div className="text-lg font-semibold text-epiroc-dark">Page not found</div>
      <div className="mt-1 text-sm text-slate-500">The page you requested doesn’t exist.</div>
      <div className="mt-4">
        <Link className="px-4 py-2 rounded-md bg-epiroc-yellow text-epiroc-dark font-semibold text-sm" to="/">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
