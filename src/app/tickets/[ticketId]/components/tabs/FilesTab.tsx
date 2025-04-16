import { useRef } from "react";
import { FaPlus, FaFile, FaDownload, FaTrash } from "react-icons/fa";
import { TicketDetails, formatFileSize } from "../types";

interface Props {
  ticket: TicketDetails;
  setTicket: React.Dispatch<React.SetStateAction<TicketDetails | null>>;
}

export default function FilesTab({ ticket, setTicket }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const curFiles = e.target.files;
    if (!curFiles || curFiles.length === 0) return;

    const formData = new FormData();
    formData.append("file", curFiles[0]);

    try {
      // API call to upload file
      const response = await fetch(`/api/tickets/${ticket?.id}/files`, {
        method: "POST",
        body: formData,
      });

      const fileData = await response.json();

      // Update local state
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              files: [
                ...prev.files,
                {
                  id: fileData.id || `f${prev.files.length + 1}`,
                  name: fileData.name || curFiles[0].name,
                  size: fileData.size || curFiles[0].size,
                  createdAt: new Date().toISOString(),
                  mimeType: fileData.mimeType || curFiles[0].type,
                },
              ],
            }
          : null,
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      // For demo purposes, update state directly
      setTicket((prev) =>
        prev
          ? {
              ...prev,
              files: [
                ...prev.files,
                {
                  id: `f${prev.files.length + 1}`,
                  name: curFiles[0].name,
                  size: curFiles[0].size,
                  createdAt: new Date().toISOString(),
                  mimeType: curFiles[0].type,
                },
              ],
            }
          : null,
      );
    }

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to handle file deletion
  const handleFileDelete = async (fileId: string) => {
    try {
      // API call to delete file
      const response = await fetch(
        `/api/tickets/${ticket.id}/files?fileId=${fileId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        // Update local state after successful deletion
        setTicket((prev) =>
          prev
            ? {
                ...prev,
                files: prev.files.filter((file) => file.id !== fileId),
              }
            : null,
        );
      } else {
        console.error("Error deleting file:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Function to handle file download
  const handleFileDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(
        `/api/tickets/${ticket.id}/files?fileId=${fileId}`,
        {
          method: "GET",
        },
      );

      if (response.ok) {
        // Get file content as blob
        const blob = await response.blob();

        // Create a download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Error downloading file:", await response.text());
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Files
        </h2>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            <FaPlus className="mr-2" /> Upload File
          </button>
        </div>
      </div>

      {/* File list */}
      {ticket.files.length > 0 ? (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {ticket.files.map((file) => (
            <li key={file.id} className="py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaFile className="mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)} • Uploaded{" "}
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    onClick={() => handleFileDownload(file.id, file.name)}
                  >
                    <FaDownload />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => handleFileDelete(file.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          No files uploaded yet
        </p>
      )}
    </div>
  );
}
