"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/footer";
import { 
  FaEdit, 
  FaCheck, 
  FaTimes, 
  FaPlus, 
  FaFile, 
  FaCalendar, 
  FaFolder, 
  FaTrash,
  FaDownload,
  FaUsers
} from "react-icons/fa";
import { useParams } from "next/navigation";

interface Developer {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface SubTicket {
  id: string;
  title: string;
  status: 'Todo' | 'InProgress' | 'Done';
}

interface Meeting {
  id: string;
  date: string;
  notes: string;
}

interface File {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  mimeType: string;
}

interface TicketDetails {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  progress: number;
  createdAt: string;
  dueDate: string;
  assignedTo: Developer[];
  assignedDepartments: Department[];
  subTickets: SubTicket[];
  files: File[];
  meetings: Meeting[];
  rating?: number;
}

export default function TicketDetailsPage() {
  const params = useParams<{ ticketId: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for ticket data
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  // Edit states
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  // Form states
  const [newMeeting, setNewMeeting] = useState({ date: '', notes: '' });
  const [newSubTicket, setNewSubTicket] = useState({ title: '', description: '', priority: 'Medium' });
  const [availableDepts, setAvailableDepts] = useState<Department[]>([]);
  const [availableDevs, setAvailableDevs] = useState<Developer[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDevs, setSelectedDevs] = useState<string[]>([]);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        // Fetch the ticket details using the ID from the URL params
        const response = await fetch(`/api/tickets/${params.ticketId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch ticket details');
        }
        
        const data = await response.json();
        setTicket(data);
        setNewProgress(data.progress);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        // For demo purposes, let's create dummy data
        setTicket({
          id: params.ticketId as string,
          title: "Fix Authentication Bug",
          description: "Users are experiencing random logouts during active sessions. Need to investigate token expiration and refresh mechanisms.",
          status: "InProgress",
          priority: "High",
          progress: 35,
          createdAt: "2023-10-15",
          dueDate: "2023-10-30",
          assignedTo: [{ id: "1", name: "Alex Johnson" }],
          assignedDepartments: [{ id: "1", name: "Backend Team" }],
          subTickets: [
            { id: "st1", title: "Investigate token expiration", status: "Done" },
            { id: "st2", title: "Implement token refresh", status: "InProgress" }
          ],
          files: [
            { id: "f1", name: "auth-logs.txt", size: 12400, createdAt: "2023-10-16", mimeType: "text/plain" }
          ],
          meetings: [
            { id: "m1", date: "2023-10-17", notes: "Discussed token refresh strategy with team" }
          ],
          rating: 0
        });
        setNewProgress(35);
      } finally {
        setLoading(false);
      }
    };

    const fetchDepartmentsAndDevs = async () => {
      try {
        const [deptResponse, devResponse] = await Promise.all([
          fetch('/api/dept'),
          fetch('/api/dev')
        ]);
        
        const depts = await deptResponse.json();
        const devs = await devResponse.json();
        
        setAvailableDepts(depts);
        setAvailableDevs(devs);
      } catch (error) {
        console.error('Error fetching departments and developers:', error);
        setAvailableDepts([
          { id: "1", name: "Backend Team" },
          { id: "2", name: "Frontend Team" },
          { id: "3", name: "QA Team" }
        ]);
        setAvailableDevs([
          { id: "1", name: "Alex Johnson" },
          { id: "2", name: "Maria Garcia" },
          { id: "3", name: "Sam Lee" }
        ]);
      }
    };

    fetchTicket();
    fetchDepartmentsAndDevs();
  }, [params.ticketId]);

  // Function to update ticket progress
  const updateProgress = async () => {
    try {
      // API call to update progress
      await fetch(`/api/tickets/${ticket?.id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: newProgress })
      });
      
      // Update local state
      setTicket(prev => prev ? { ...prev, progress: newProgress } : null);
      setIsEditingProgress(false);
    } catch (error) {
      console.error('Error updating progress:', error);
      // For demo, just update the state
      setTicket(prev => prev ? { ...prev, progress: newProgress } : null);
      setIsEditingProgress(false);
    }
  };

  // Function to add a new meeting
  const addMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.date || !newMeeting.notes) return;
    
    try {
      // API call to add meeting
      const response = await fetch(`/api/tickets/${ticket?.id}/meetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMeeting)
      });
      
      const newMeetingData = await response.json();
      
      // Update local state
      setTicket(prev => prev ? { 
        ...prev, 
        meetings: [...prev.meetings, { 
          id: newMeetingData.id || `m${prev.meetings.length + 1}`, 
          ...newMeeting 
        }] 
      } : null);
      
      // Reset form
      setNewMeeting({ date: '', notes: '' });
    } catch (error) {
      console.error('Error adding meeting:', error);
      // For demo purposes, update state directly
      setTicket(prev => prev ? { 
        ...prev, 
        meetings: [...prev.meetings, { 
          id: `m${prev.meetings.length + 1}`, 
          ...newMeeting 
        }] 
      } : null);
      setNewMeeting({ date: '', notes: '' });
    }
  };

  // Function to add a new sub-ticket
  const addSubTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTicket.title) return;
    
    try {
      // API call to add sub-ticket
      const response = await fetch(`/api/tickets/${ticket?.id}/subtasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubTicket)
      });
      
      const newSubTicketData = await response.json();
      
      // Update local state
      setTicket(prev => prev ? { 
        ...prev, 
        subTickets: [...prev.subTickets, { 
          id: newSubTicketData.id || `st${prev.subTickets.length + 1}`, 
          title: newSubTicket.title,
          status: 'Todo' as const
        }] 
      } : null);
      
      // Reset form
      setNewSubTicket({ title: '', description: '', priority: 'Medium' });
    } catch (error) {
      console.error('Error adding sub-ticket:', error);
      // For demo purposes, update state directly
      setTicket(prev => prev ? { 
        ...prev, 
        subTickets: [...prev.subTickets, { 
          id: `st${prev.subTickets.length + 1}`, 
          title: newSubTicket.title,
          status: 'Todo' as const
        }] 
      } : null);
      setNewSubTicket({ title: '', description: '', priority: 'Medium' });
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const formData = new FormData();
    formData.append('file', files[0]);
    
    try {
      // API call to upload file
      const response = await fetch(`/api/tickets/${ticket?.id}/files`, {
        method: 'POST',
        body: formData
      });
      
      const fileData = await response.json();
      
      // Update local state
      setTicket(prev => prev ? { 
        ...prev, 
        files: [...prev.files, { 
          id: fileData.id || `f${prev.files.length + 1}`, 
          name: files[0].name,
          size: files[0].size,
          createdAt: new Date().toISOString(),
          mimeType: files[0].type
        }] 
      } : null);
    } catch (error) {
      console.error('Error uploading file:', error);
      // For demo purposes, update state directly
      setTicket(prev => prev ? { 
        ...prev, 
        files: [...prev.files, { 
          id: `f${prev.files.length + 1}`, 
          name: files[0].name,
          size: files[0].size,
          createdAt: new Date().toISOString(),
          mimeType: files[0].type
        }] 
      } : null);
    }
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to assign department
  const assignDepartment = async () => {
    if (!selectedDept) return;
    
    const deptToAdd = availableDepts.find(d => d.id === selectedDept);
    if (!deptToAdd) return;
    
    try {
      // API call to assign department
      await fetch(`/api/tickets/${ticket?.id}/dept`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ departmentId: selectedDept })
      });
      
      // Update local state
      setTicket(prev => {
        if (!prev) return null;
        
        // Check if department is already assigned
        if (prev.assignedDepartments.some(d => d.id === deptToAdd.id)) {
          return prev;
        }
        
        return { 
          ...prev, 
          assignedDepartments: [...prev.assignedDepartments, deptToAdd]
        };
      });
      
      // Reset selection
      setSelectedDept('');
    } catch (error) {
      console.error('Error assigning department:', error);
      // For demo purposes, update state directly
      setTicket(prev => {
        if (!prev) return null;
        
        // Check if department is already assigned
        if (prev.assignedDepartments.some(d => d.id === deptToAdd.id)) {
          return prev;
        }
        
        return { 
          ...prev, 
          assignedDepartments: [...prev.assignedDepartments, deptToAdd]
        };
      });
      setSelectedDept('');
    }
  };

  // Function to assign developers
  const assignDevelopers = async () => {
    if (selectedDevs.length === 0) return;
    
    const devsToAdd = availableDevs.filter(d => selectedDevs.includes(d.id));
    if (devsToAdd.length === 0) return;
    
    try {
      // API call to assign developers
      await fetch(`/api/tickets/${ticket?.id}/dev`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerIds: selectedDevs })
      });
      
      // Update local state
      setTicket(prev => {
        if (!prev) return null;
        
        const currentDevIds = new Set(prev.assignedTo.map(d => d.id));
        const newDevs = devsToAdd.filter(d => !currentDevIds.has(d.id));
        
        return { 
          ...prev, 
          assignedTo: [...prev.assignedTo, ...newDevs]
        };
      });
      
      // Reset selection
      setSelectedDevs([]);
    } catch (error) {
      console.error('Error assigning developers:', error);
      // For demo purposes, update state directly
      setTicket(prev => {
        if (!prev) return null;
        
        const currentDevIds = new Set(prev.assignedTo.map(d => d.id));
        const newDevs = devsToAdd.filter(d => !currentDevIds.has(d.id));
        
        return { 
          ...prev, 
          assignedTo: [...prev.assignedTo, ...newDevs]
        };
      });
      setSelectedDevs([]);
    }
  };

  // Function to handle developer selection
  const handleDevSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDevs(selected);
  };

  // Get color for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Low": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get color for status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "InProgress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Done": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-4">
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse">Loading ticket details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-4">
          <div className="flex justify-center items-center h-full">
            <div className="text-red-500">Ticket not found</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main render
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-4">
        <div className="container mx-auto max-w-5xl">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/tickets" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
              <span>← Back to tickets</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ticket.title}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {ticket.id} • Created: {new Date(ticket.createdAt).toLocaleDateString()} • Due: {new Date(ticket.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <FaEdit className="mr-2" /> Edit Ticket
                </button>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                {isEditingProgress ? (
                  <div className="flex items-center gap-2">
                    <button onClick={updateProgress} className="text-green-600 dark:text-green-400">
                      <FaCheck />
                    </button>
                    <button onClick={() => setIsEditingProgress(false)} className="text-red-600 dark:text-red-400">
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingProgress(true)} 
                    className="text-sm text-blue-600 dark:text-blue-400"
                  >
                    Update
                  </button>
                )}
              </div>
              
              {isEditingProgress ? (
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={newProgress}
                  onChange={e => setNewProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              ) : (
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className={`h-2 rounded-full ${
                      ticket.progress < 30 ? 'bg-red-600' : 
                      ticket.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${ticket.progress}%` }}
                  ></div>
                </div>
              )}
              <div className="text-right mt-1 text-sm text-gray-500 dark:text-gray-400">
                {ticket.progress}%
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'details' 
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Details
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('subtasks')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'subtasks' 
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Subtasks
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'assignments' 
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Assignments
                </button>
              </li>
              <li className="mr-2">
                <button
                  onClick={() => setActiveTab('files')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'files' 
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Files
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('meetings')}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'meetings' 
                    ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  }`}
                >
                  Meetings
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {/* Details Tab */}
            {activeTab === 'details' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Ticket Details</h2>
                
                {/* Basic information grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{ticket.status}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Priority</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{ticket.priority}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{new Date(ticket.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Assigned departments */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Departments</h3>
                  {ticket.assignedDepartments.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {ticket.assignedDepartments.map(dept => (
                        <span key={dept.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800">
                          {dept.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No departments assigned</p>
                  )}
                </div>

                {/* Assigned developers */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned Developers</h3>
                  {ticket.assignedTo.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {ticket.assignedTo.map(dev => (
                        <span key={dev.id} className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800">
                          {dev.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No developers assigned</p>
                  )}
                </div>
              </div>
            )}

            {/* Subtasks Tab */}
            {activeTab === 'subtasks' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subtasks</h2>
                </div>
                
                {/* Subtask list */}
                {ticket.subTickets.length > 0 ? (
                  <ul className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {ticket.subTickets.map(subtask => (
                      <li key={subtask.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`mr-2 inline-flex h-2 w-2 rounded-full ${
                              subtask.status === 'Done' ? 'bg-green-500' :
                              subtask.status === 'InProgress' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></span>
                            <Link href={`/tickets/${subtask.id}`} className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {subtask.title}
                            </Link>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(subtask.status)}`}>
                            {subtask.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mb-6">No subtasks created yet</p>
                )}

                {/* Create subtask form */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create Subtask</h3>
                  <form onSubmit={addSubTicket} className="space-y-4">
                    <div>
                      <label htmlFor="subtask-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                      </label>
                      <input
                        id="subtask-title"
                        name="title"
                        type="text"
                        required
                        value={newSubTicket.title}
                        onChange={e => setNewSubTicket({...newSubTicket, title: e.target.value})}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="subtask-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        id="subtask-description"
                        name="description"
                        rows={3}
                        value={newSubTicket.description}
                        onChange={e => setNewSubTicket({...newSubTicket, description: e.target.value})}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="subtask-priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Priority
                      </label>
                      <select
                        id="subtask-priority"
                        name="priority"
                        value={newSubTicket.priority}
                        onChange={e => setNewSubTicket({...newSubTicket, priority: e.target.value as 'Low' | 'Medium' | 'High'})}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <FaPlus className="mr-2" /> Create Subtask
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Assignments Tab */}
            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Manage Assignments</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Department assignment section */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      <FaFolder className="inline mr-2" /> Assigned Departments
                    </h3>
                    
                    {/* Current departments */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current</h4>
                      <div className="flex flex-wrap gap-2">
                        {ticket.assignedDepartments.length > 0 ? (
                          ticket.assignedDepartments.map(dept => (
                            <div key={dept.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-800">
                              {dept.name}
                              {/* <button className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800">
                                ×
                              </button> */}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No departments assigned</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Assign new department */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign New Department</h4>
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedDept}
                          onChange={e => setSelectedDept(e.target.value)}
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select Department</option>
                          {availableDepts.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={assignDepartment}
                          disabled={!selectedDept}
                          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Developer assignment section */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      <FaUsers className="inline mr-2" /> Assigned Developers
                    </h3>
                    
                    {/* Current developers */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current</h4>
                      <div className="flex flex-wrap gap-2">
                        {ticket.assignedTo.length > 0 ? (
                          ticket.assignedTo.map(dev => (
                            <div key={dev.id} className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-800">
                              {dev.name}
                              {/* <button className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800">
                                ×
                              </button> */}
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">No developers assigned</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Assign new developers */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign Developers</h4>
                      <div className="flex flex-col gap-2">
                        <select
                          multiple
                          value={selectedDevs}
                          onChange={handleDevSelection}
                          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        >
                          {availableDevs.map(dev => (
                            <option key={dev.id} value={dev.id}>{dev.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hold Ctrl (or Cmd) to select multiple developers</p>
                        <button
                          onClick={assignDevelopers}
                          disabled={selectedDevs.length === 0}
                          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Files</h2>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <FaPlus className="mr-2" /> Upload File
                    </button>
                  </div>
                </div>
                
                {/* File list */}
                {ticket.files.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {ticket.files.map(file => (
                      <li key={file.id} className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <FaFile className="mr-3 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatFileSize(file.size)} • Uploaded {new Date(file.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                              <FaDownload />
                            </button>
                            <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No files uploaded yet</p>
                )}
              </div>
            )}

            {/* Meetings Tab */}
            {activeTab === 'meetings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Meetings</h2>
                
                {/* Meeting list */}
                {ticket.meetings.length > 0 ? (
                  <div className="mb-6 divide-y divide-gray-200 dark:divide-gray-700">
                    {ticket.meetings.map(meeting => (
                      <div key={meeting.id} className="py-4">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1 flex-shrink-0">
                            <FaCalendar className="text-gray-400" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(meeting.date).toLocaleDateString()}</p>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{meeting.notes}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 mb-6">No meetings recorded yet</p>
                )}

                {/* Add meeting form */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Meeting</h3>
                  <form onSubmit={addMeeting} className="space-y-4">
                    <div>
                      <label htmlFor="meeting-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date
                      </label>
                      <input
                        id="meeting-date"
                        name="date"
                        type="date"
                        required
                        value={newMeeting.date}
                        onChange={e => setNewMeeting({...newMeeting, date: e.target.value})}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="meeting-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Notes
                      </label>
                      <textarea
                        id="meeting-notes"
                        name="notes"
                        rows={3}
                        required
                        value={newMeeting.notes}
                        onChange={e => setNewMeeting({...newMeeting, notes: e.target.value})}
                        className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:ring-blue-500 focus:outline-none sm:text-sm dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        placeholder="Meeting discussion points..."
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <FaPlus className="mr-2" /> Add Meeting
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
