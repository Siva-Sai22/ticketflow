"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

interface Department {
  id: string;
  name: string;
}

interface Developer {
  id: string;
  email: string;
  department: {
    id: string;
  };
}

export default function CreateTicket() {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [availableDevelopers, setAvailableDevelopers] = useState<Developer[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Todo",
    priority: "Medium",
    progress: 0,
    dueDate: "",
    assignedDepartments: [] as string[],
    assignedDevelopers: [] as string[],
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/dept");
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    const fetchDevelopers = async () => {
      try {
        const response = await fetch("/api/dev");
        const data = await response.json();
        setDevelopers(data);
      } catch (error) {
        console.error("Error fetching developers:", error);
      }
    };

    fetchDepartments();
    fetchDevelopers();
  }, []);

  useEffect(() => {
    if (formData.assignedDepartments.length > 0 && developers.length > 0) {
      const filteredDevelopers = developers.filter((dev) => {
        return formData.assignedDepartments.includes(dev.department.id);
      });
      setAvailableDevelopers(filteredDevelopers);
    } else {
      setAvailableDevelopers([]);
    }
  }, [formData.assignedDepartments, developers]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "assignedDepartments" || name === "assignedDevelopers") {
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        (option) => option.value,
      );

      setFormData((prev) => ({
        ...prev,
        [name]: selectedOptions,
      }));

      if (name === "assignedDepartments") {
        setFormData((prev) => ({
          ...prev,
          assignedDevelopers: [],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/tickets");
      } else {
        const error = await response.json();
        console.error("Error creating ticket:", error);
        alert("Failed to create ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-grow items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="w-full max-w-lg space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Create a New Ticket
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Fill out the form below to create a new ticket
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label
                  htmlFor="title"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Ticket title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  placeholder="Describe the issue or feature"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Todo">Todo</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="priority"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="progress"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Progress (%)
                  </label>
                  <input
                    id="progress"
                    name="progress"
                    type="number"
                    min="0"
                    max="100"
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    placeholder="0"
                    value={formData.progress}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="dueDate"
                    className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Due Date
                  </label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    required
                    className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="assignedDepartments"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Assigned Departments
                </label>
                <select
                  id="assignedDepartments"
                  name="assignedDepartments"
                  multiple
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  onChange={handleChange}
                  value={formData.assignedDepartments}
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Hold Ctrl (or Cmd) to select multiple departments
                </p>
              </div>

              <div
                className={
                  formData.assignedDepartments.length === 0 ? "opacity-50" : ""
                }
              >
                <label
                  htmlFor="assignedDevelopers"
                  className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Assign Developers
                </label>
                <select
                  id="assignedDevelopers"
                  name="assignedDevelopers"
                  multiple
                  disabled={formData.assignedDepartments.length === 0}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white disabled:dark:bg-gray-600"
                  onChange={handleChange}
                  value={formData.assignedDevelopers}
                >
                  {availableDevelopers.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {formData.assignedDepartments.length === 0
                    ? "Select departments first to see available developers"
                    : "Hold Ctrl (or Cmd) to select multiple developers"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Link
                href="/tickets"
                className="flex w-full justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
