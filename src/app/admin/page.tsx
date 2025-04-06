"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/footer";

interface Department {
  id: string;
  name: string;
  teamLead?: {
    email: string;
  };
}

export default function AdminPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentName, setDepartmentName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/dept");
        const data = await response.json();
        console.log("Fetched departments:", data);
        setDepartments(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Failed to load departments. Please try again.");
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!departmentName.trim()) {
      setError("Department name is required");
      return;
    }

    try {
      const response = await fetch("/api/dept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: departmentName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create department");
      }

      const newDepartment = await response.json();
      setDepartments([...departments, newDepartment]);
      setSuccess("Department created successfully!");
      setDepartmentName("");
    } catch (err) {
      console.error("Error creating department:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto flex-grow px-4 py-8 bg-gray-50 dark:bg-gray-900">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left sidebar - Navigation */}
          <div className="h-fit rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Admin Controls</h2>
            <nav className="space-y-2">
              <a
                href="#departments"
                className="block rounded-md bg-blue-600 px-3 py-2 text-white font-medium"
              >
                Departments
              </a>
              {/* <a
                href="#"
                className="block rounded-md px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Developers
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Tickets
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Settings
              </a> */}
            </nav>
          </div>

          {/* Main content area */}
          <div className="space-y-6 md:col-span-2">
            {/* Create Department Form - Simplified */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                Create New Department
              </h2>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="departmentName"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Department Name
                  </label>
                  <input
                    type="text"
                    id="departmentName"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="Engineering"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                  Create Department
                </button>
              </form>
            </div>

            {/* Department List */}
            <div id="departments" className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Departments</h2>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
              ) : departments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Department Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Team Lead
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                      {departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {dept.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {dept.teamLead?.email || "Not assigned"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <button className="mr-3 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">Edit</button>
                            <button className="font-medium text-red-600 hover:text-red-500 dark:text-red-400">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-md bg-white py-8 text-center text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                  No departments found. Create one using the form above.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
