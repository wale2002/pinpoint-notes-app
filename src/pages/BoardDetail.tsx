/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StickyNote } from "@/components/ui/sticky-note";
import { ArrowLeft, Plus } from "lucide-react";
import { noteAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import CreateNoteDialog from "@/components/CreateNoteDialog";

interface Note {
  _id: string;
  title: string;
  description?: string;
  category: string;
  color: string;
  todos?: Array<{ text: string; checked: boolean }>;
  priority?: string;
  completionStatus?: string;
  lastUpdated: string;
}

const BoardDetail: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (boardId) {
      fetchNotes();
    }
  }, [boardId]);

  const fetchNotes = async () => {
    if (!boardId) return;

    try {
      const response = await noteAPI.getByBoard(decodeURIComponent(boardId));
      setNotes(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteCreated = () => {
    fetchNotes();
    setIsCreateDialogOpen(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await noteAPI.delete(noteId);
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      fetchNotes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const boardName = boardId ? decodeURIComponent(boardId) : "";

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/boards")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Boards
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {boardName}
              </h1>
              <p className="text-muted-foreground">
                {notes.length} note{notes.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-sticky-yellow p-8 rounded-lg shadow-sticky max-w-md mx-auto transform -rotate-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-700 mb-4">
                Start adding sticky notes to this board!
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max">
            {notes.map((note) => (
              <div key={note._id} className="group">
                <StickyNote
                  title={note.title}
                  description={note.description}
                  category={note.category}
                  color={note.color}
                  priority={note.priority}
                  completionStatus={note.completionStatus}
                  todos={note.todos}
                  onDelete={() => handleDeleteNote(note._id)}
                  className="h-auto"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Note Dialog */}
      <CreateNoteDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onNoteCreated={handleNoteCreated}
        boardName={boardName}
      />
    </div>
  );
};

export default BoardDetail;
