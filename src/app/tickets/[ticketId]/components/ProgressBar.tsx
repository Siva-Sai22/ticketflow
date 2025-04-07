import { FaCheck, FaTimes } from "react-icons/fa";

interface Props {
  progress: number;
  isEditing: boolean;
  newProgress: number;
  setNewProgress: (value: number) => void;
  setIsEditing: (value: boolean) => void;
  updateProgress: () => void;
}

export default function ProgressBar({
  progress,
  isEditing,
  newProgress,
  setNewProgress,
  setIsEditing,
  updateProgress
}: Props) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={updateProgress}
              className="text-green-600 dark:text-green-400"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-600 dark:text-red-400"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 dark:text-blue-400"
          >
            Update
          </button>
        )}
      </div>

      {isEditing ? (
        <input
          type="range"
          min="0"
          max="100"
          value={newProgress}
          onChange={(e) => setNewProgress(parseInt(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
        />
      ) : (
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className={`h-2 rounded-full ${
              progress < 30
                ? "bg-red-600"
                : progress < 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      <div className="mt-1 text-right text-sm text-gray-500 dark:text-gray-400">
        {isEditing ? newProgress : progress}%
      </div>
    </div>
  );
}
