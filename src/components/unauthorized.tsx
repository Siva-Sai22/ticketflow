import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
          You do not have permission to access this page.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}