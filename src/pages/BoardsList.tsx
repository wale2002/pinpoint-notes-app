/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Plus, StickyNote, Calendar } from "lucide-react";
import { boardAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Board {
  name: string;
  noteCount: number;
  lastUpdated: string;
}

const BoardsList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await boardAPI.getAll();
      setBoards(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load boards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/create-board")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Board
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Boards
          </h1>
          <p className="text-muted-foreground">
            {boards.length === 0
              ? "No boards yet. Create your first board to get started!"
              : `You have ${boards.length} board${
                  boards.length === 1 ? "" : "s"
                }`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading boards...</p>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-sticky-yellow p-8 rounded-lg shadow-sticky max-w-md mx-auto transform rotate-1">
              <StickyNote className="h-12 w-12 mx-auto mb-4 text-gray-700" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                No boards yet
              </h3>
              <p className="text-gray-700 mb-4">
                Create your first board to start organizing your notes!
              </p>
              <Button
                onClick={() => navigate("/create-board")}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Board
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-hover transition-all duration-200 transform hover:scale-105"
                onClick={() =>
                  navigate(`/boards/${encodeURIComponent(board.name)}`)
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="h-5 w-5 text-primary" />
                    {board.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span>
                      {board.noteCount} note{board.noteCount === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3" />
                      {formatDate(board.lastUpdated)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-1">
                      {/* Visual indicator of note density */}
                      {Array.from({ length: Math.min(board.noteCount, 5) }).map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 bg-primary/20 rounded-full"
                          />
                        )
                      )}
                      {board.noteCount > 5 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          +{board.noteCount - 5}
                        </span>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Open →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardsList;
