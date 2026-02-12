import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import JournalForm from '../components/journal/JournalForm';
import JournalCard from '../components/journal/JournalCard';
import JournalModal from '../components/journal/JournalModal';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user
    const userStr = localStorage.getItem('travys_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        fetchUserJournals(user.id);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserJournals = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('travys_token');
      
      if (!token) {
        toast.error('Please login to view journals');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/journal/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setJournals(data.journals);
      } else {
        toast.error('Failed to load journals');
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Failed to load journals');
    } finally {
      setLoading(false);
    }
  };

  const handleJournalCreated = (newJournal) => {
    setJournals([newJournal, ...journals]);
    setShowCreateForm(false);
    toast.success('Journal created successfully!');
  };

  const handleViewJournal = (journal) => {
    setSelectedJournal(journal);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditJournal = (journal) => {
    setSelectedJournal(journal);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleJournalUpdated = (updatedJournal) => {
    setJournals(journals.map(j => 
      j._id === updatedJournal._id ? updatedJournal : j
    ));
    setSelectedJournal(updatedJournal);
  };

  const handleDeleteJournal = async (journalId) => {
    if (!confirm('Are you sure you want to delete this journal? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('travys_token');
      const response = await fetch(`${API_URL}/api/journal/${journalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setJournals(journals.filter(j => j._id !== journalId));
        toast.success('Journal deleted successfully!');
        if (isModalOpen) {
          setIsModalOpen(false);
          setSelectedJournal(null);
        }
      } else {
        toast.error('Failed to delete journal');
      }
    } catch (error) {
      console.error('Error deleting journal:', error);
      toast.error('Failed to delete journal');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJournal(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-rose-500 animate-spin mb-4" />
        <p className="text-slate-600">Loading your journals...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-rose-500" />
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Travel Journal</h1>
              <p className="text-slate-600">Capture and preserve your travel memories</p>
            </div>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="gap-2"
          >
            {showCreateForm ? (
              <>
                <ChevronUp className="h-5 w-5" />
                Hide Form
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create Journal
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm font-medium">Total Journals</p>
              <p className="text-3xl font-bold mt-1">{journals.length}</p>
            </div>
            <BookOpen className="h-12 w-12 opacity-20" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Public Journals</p>
              <p className="text-3xl font-bold mt-1">
                {journals.filter(j => j.isPublic).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🌍</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Private Journals</p>
              <p className="text-3xl font-bold mt-1">
                {journals.filter(j => !j.isPublic).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
          </div>
        </div>
      </div>

      {/* Create Journal Form */}
      {showCreateForm && (
        <div className="mb-6">
          <JournalForm onJournalCreated={handleJournalCreated} />
        </div>
      )}

      {/* Journal Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">My Journals</h2>
          <p className="text-sm text-slate-600">
            {journals.length} {journals.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>

        {journals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No journals yet
            </h3>
            <p className="text-slate-600 mb-6">
              Start documenting your travel experiences!
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Create Your First Journal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal) => (
              <JournalCard
                key={journal._id}
                journal={journal}
                onView={handleViewJournal}
                onEdit={handleEditJournal}
                onDelete={handleDeleteJournal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Journal Modal */}
      <JournalModal
        journal={selectedJournal}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleJournalUpdated}
        mode={modalMode}
      />
    </div>
  );
}
