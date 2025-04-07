interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: Props) {
  const tabs = [
    { id: "details", label: "Details" },
    { id: "subtasks", label: "Subtasks" },
    { id: "assignments", label: "Assignments" },
    { id: "files", label: "Files" },
    { id: "meetings", label: "Meetings" },
  ];

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
      <ul className="-mb-px flex flex-wrap text-center text-sm font-medium">
        {tabs.map(tab => (
          <li key={tab.id} className="mr-2">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`inline-block rounded-t-lg border-b-2 p-4 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                  : "border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
