import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-base-100 text-base-content p-4 font-inter">
      <h1 className="text-6xl font-bold font-mono text-primary">404</h1>
      <p className="mt-4 text-xl opacity-70">Page not found</p>

      <Link
        to="/"
        className="btn btn-primary mt-8"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
