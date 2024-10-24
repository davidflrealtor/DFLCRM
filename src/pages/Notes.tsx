import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Link } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorageItem, setStorageItem } from '../utils/localStorage';
import { Note } from '../types/Note';
import { Contact } from '../types/Contact';
import { Task } from '../types/Task';
import { Transaction } from '../types/Transaction';

const NOTES_STORAGE_KEY = 'crm_notes';

const fetchNotes = async (): Promise<Note[]> => {
  return getStorageItem<Note[]>(NOTES_STORAGE_KEY, []);
};

const Notes: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: notes, isLoading, isError } = useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ['contacts'],
    queryFn: () => getStorageItem('crm_contacts', []),
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: () => getStorageItem('crm_tasks', []),
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => getStorageItem('crm_transactions', []),
  });

  const createNoteMutation = useMutation({
    mutationFn: (newNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const notes = getStorageItem<Note[]>(NOTES_STORAGE_KEY, []);
      const note: Note = {
        ...newNote,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedNotes = [...notes, note];
      setStorageItem(NOTES_STORAGE_KEY, updatedNotes);
      return note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNote(null);
      setIsEditing(false);
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: (updatedNote: Note) => {
      const notes = getStorageItem<Note[]>(NOTES_STORAGE_KEY, []);
      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note
      );
      setStorageItem(NOTES_STORAGE_KEY, updatedNotes);
      return updatedNote;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNote(null);
      setIsEditing(false);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => {
      const notes = getStorageItem<Note[]>(NOTES_STORAGE_KEY, []);
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setStorageItem(NOTES_STORAGE_KEY, updatedNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNote(null);
    },
  });

  const handleCreateNote = () => {
    setSelectedNote({ id: 0, title: '', content: '', createdAt: '', updatedAt: '' });
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = () => {
    if (selectedNote) {
      if (selectedNote.id === 0) {
        createNoteMutation.mutate({ title: selectedNote.title, content: selectedNote.content });
      } else {
        updateNoteMutation.mutate(selectedNote);
      }
    }
  };

  const handleDeleteNote = (noteId: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  if (isLoading) return <div className="p-6 text-gray-800">Loading...</div>;
  if (isError) return <div className="p-6 text-gray-800">Error fetching notes</div>;

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition duration-300"
          onClick={handleCreateNote}
        >
          <Plus size={20} className="mr-2" />
          Add Note
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Note List</h2>
          <ul className="space-y-2">
            {notes?.map((note) => (
              <li
                key={note.id}
                className={`p-2 rounded cursor-pointer ${
                  selectedNote?.id === note.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <h3 className="font-medium text-gray-800">{note.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 bg-white shadow rounded-lg p-4">
          {selectedNote ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? 'Edit Note' : 'Note Details'}
                </h2>
                <div>
                  {!isEditing && (
                    <>
                      <button
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        onClick={() => handleEditNote(selectedNote)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteNote(selectedNote.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded mb-4 text-gray-800"
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote({ ...selectedNote, title: e.target.value })
                    }
                    placeholder="Note Title"
                  />
                  <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    value={selectedNote.content}
                    onChange={(content) =>
                      setSelectedNote({ ...selectedNote, content })
                    }
                    className="mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                      onClick={handleSaveNote}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800">{selectedNote.title}</h3>
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: selectedNote.content }}
                  />
                  <p className="text-sm text-gray-500 mt-4">
                    Last updated: {new Date(selectedNote.updatedAt).toLocaleString()}
                  </p>
                  {selectedNote.contactId && (
                    <p className="text-sm text-gray-600 mt-2">
                      <Link size={16} className="inline mr-2" />
                      Related Contact: {contacts?.find(c => c.id === selectedNote.contactId)?.name}
                    </p>
                  )}
                  {selectedNote.taskId && (
                    <p className="text-sm text-gray-600 mt-2">
                      <Link size={16} className="inline mr-2" />
                      Related Task: {tasks?.find(t => t.id === selectedNote.taskId)?.title}
                    </p>
                  )}
                  {selectedNote.transactionId && (
                    <p className="text-sm text-gray-600 mt-2">
                      <Link size={16} className="inline mr-2" />
                      Related Transaction: {transactions?.find(t => t.id === selectedNote.transactionId)?.propertyAddress}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Select a note to view details or create a new one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;