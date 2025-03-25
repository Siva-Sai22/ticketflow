import Link from "next/link";

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <div className="mb-10 md:mb-0 md:w-1/2">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Streamline Your Development Workflow
            </h1>
            <p className="mb-8 text-xl">
              TicketFlow helps teams track issues, manage projects, and
              streamline development workflows.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link
                href="/signup"
                className="rounded-md bg-white px-6 py-3 text-center font-medium text-blue-600 hover:bg-gray-100"
              >
                Get Started
              </Link>
              <Link
                href="/features"
                className="rounded-md border border-white px-6 py-3 text-center font-medium hover:bg-blue-700"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="rounded-lg bg-white/10 p-6 shadow-lg backdrop-blur-sm">
              <div className="flex aspect-video items-center justify-center rounded-md bg-gray-800/40">
                <svg
                  className="h-16 w-16 text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
