import React, { useState, useEffect } from 'react';
import { Save, FileText, Trash2 } from 'lucide-react';
import { TrialSession } from '@/types/trial';
import { toast } from '@/components/ui/Toaster';

interface TrialNotesProps {
  session: TrialSession;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const TrialNotes = ({ session }: TrialNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`trial_notes_${session.id}`);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    }
  }, [session.id]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(`trial_notes_${session.id}`, JSON.stringify(notes));
  }, [notes, session.id]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setTitle(newNote.title);
    setContent(newNote.content);
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(false);
    setTitle(note.title);
    setContent(note.content);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      title: title.trim() || 'Untitled Note',
      content: content.trim(),
      updatedAt: new Date().toISOString(),
    };

    setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
    setSelectedNote(updatedNote);
    setIsEditing(false);
    toast.success('Note saved');
  };

  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== noteId));
      if (selectedNote?.id === noteId) {
        setSelectedNote(null);
        setIsEditing(false);
        setTitle('');
        setContent('');
      }
      toast.success('Note deleted');
    }
  };

  const cancelEditing = () => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    }
    setIsEditing(false);
  };

  return (
    <div className="trial-notes">
      <div className="trial-notes-header">
        <h3 className="trial-notes-title">
          <FileText className="trial-notes-icon" />
          My Notes
        </h3>
        <button
          onClick={createNewNote}
          className="trial-notes-new-button"
        >
          New Note
        </button>
      </div>

      <div className="trial-notes-content">
        {/* Notes List */}
        <div className="trial-notes-sidebar">
          <div className="trial-notes-list">
            {notes.length === 0 ? (
              <div className="trial-notes-empty">
                <FileText className="trial-notes-empty-icon" />
                <p>No notes yet</p>
                <p className="trial-notes-empty-subtitle">
                  Create your first note to get started
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`trial-notes-item ${
                    selectedNote?.id === note.id ? 'trial-notes-item-selected' : ''
                  }`}
                  onClick={() => selectNote(note)}
                >
                  <div className="trial-notes-item-header">
                    <h4 className="trial-notes-item-title">
                      {note.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="trial-notes-delete-button"
                    >
                      <Trash2 className="trial-notes-delete-icon" />
                    </button>
                  </div>
                  <p className="trial-notes-item-preview">
                    {note.content.substring(0, 100)}
                    {note.content.length > 100 && '...'}
                  </p>
                  <p className="trial-notes-item-date">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="trial-notes-editor">
          {selectedNote ? (
            <div className="trial-notes-editor-content">
              <div className="trial-notes-editor-header">
                {isEditing ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="trial-notes-title-input"
                    placeholder="Note title..."
                    autoFocus
                  />
                ) : (
                  <h2 className="trial-notes-editor-title">
                    {selectedNote.title}
                  </h2>
                )}
                <div className="trial-notes-editor-actions">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveNote}
                        className="trial-notes-save-button"
                        disabled={!title.trim()}
                      >
                        <Save className="trial-notes-save-icon" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="trial-notes-cancel-button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="trial-notes-edit-button"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="trial-notes-editor-body">
                {isEditing ? (
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="trial-notes-content-textarea"
                    placeholder="Write your notes here..."
                    rows={20}
                  />
                ) : (
                  <div className="trial-notes-content-display">
                    {selectedNote.content || (
                      <p className="trial-notes-empty-content">
                        This note is empty. Click Edit to add content.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="trial-notes-editor-footer">
                <p className="trial-notes-meta">
                  Created: {new Date(selectedNote.createdAt).toLocaleString()}
                </p>
                <p className="trial-notes-meta">
                  Updated: {new Date(selectedNote.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="trial-notes-welcome">
              <FileText className="trial-notes-welcome-icon" />
              <h3>Select a note to view or edit</h3>
              <p>Choose a note from the sidebar or create a new one to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialNotes;
