"use client";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/user-context";

export default function Hero() {
  const { userData } = useUser();

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
              {userData ? (
                <Link
                  href="/tickets"
                  className="rounded-md bg-white px-6 py-3 text-center font-medium text-blue-600 hover:bg-gray-100"
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="rounded-md bg-white px-6 py-3 text-center font-medium text-blue-600 hover:bg-gray-100"
                >
                  Get Started
                </Link>
              )}
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
              <div className="relative aspect-video rounded-md bg-gray-800/40">
                <Image
                  src="/logo.jpg"
                  alt="TicketFlow Logo"
                  className="rounded-md object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
