// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { ArrowLeft, Plus, Trash2, Edit, Check, X } from "lucide-react";
// import { noteAPI } from "@/lib/api";
// import { useToast } from "@/hooks/use-toast";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface Note {
//   _id: string;
//   title: string;
//   description?: string;
//   category: string;
//   color: string;
//   priority?: string;
//   completionStatus?: string;
//   todos?: Array<{ text: string; checked: boolean }>;
//   boardId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Position {
//   left: number;
//   top: number;
//   rotate: number;
//   zIndex: number;
// }

// const BoardVisualization: React.FC = () => {
//   const { boardName } = useParams<{ boardName: string }>();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [positions, setPositions] = useState<{ [id: string]: Position }>({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [editingNote, setEditingNote] = useState<Note | null>(null);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [newNote, setNewNote] = useState({
//     title: "",
//     description: "",
//     category: "",
//     color: "#ffff99",
//     priority: "medium",
//     completionStatus: "pending",
//     todos: [] as Array<{ text: string; checked: boolean }>,
//   });
//   const [editingTodo, setEditingTodo] = useState<{
//     index: number;
//     text: string;
//   } | null>(null);

//   useEffect(() => {
//     if (boardName) {
//       fetchNotes();
//     }
//   }, [boardName]);

//   useEffect(() => {
//     setPositions((prev) => {
//       const newPos = { ...prev };
//       notes.forEach((note) => {
//         if (!newPos[note._id]) {
//           newPos[note._id] = {
//             left: Math.random() * 80 + 5,
//             top: Math.random() * 80 + 5,
//             rotate: Math.random() * 10 - 5,
//             zIndex: Math.floor(Math.random() * 100),
//           };
//         }
//       });
//       return newPos;
//     });
//   }, [notes]);

//   const fetchNotes = async () => {
//     try {
//       const response = await noteAPI.getByBoard(boardName!);
//       setNotes(response.data || []);
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to load notes",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateNote = async () => {
//     try {
//       await noteAPI.create({ ...newNote, boardId: boardName! });
//       setShowCreateModal(false);
//       setNewNote({
//         title: "",
//         description: "",
//         category: "",
//         color: "#ffff99",
//         priority: "medium",
//         completionStatus: "pending",
//         todos: [],
//       });
//       fetchNotes();
//       toast({ title: "Success", description: "Note created successfully" });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to create note",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleUpdateNote = async () => {
//     if (!editingNote) return;
//     try {
//       await noteAPI.update(editingNote._id, editingNote);
//       setEditingNote(null);
//       fetchNotes();
//       toast({ title: "Success", description: "Note updated successfully" });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to update note",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleDeleteNote = async (noteId: string) => {
//     try {
//       await noteAPI.delete(noteId);
//       fetchNotes();
//       toast({ title: "Success", description: "Note deleted successfully" });
//     } catch (error: any) {
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to delete note",
//         variant: "destructive",
//       });
//     }
//   };

//   const toggleTodo = (todoIndex: number) => {
//     if (!editingNote) return;
//     setEditingNote({
//       ...editingNote,
//       todos: editingNote.todos?.map((todo, i) =>
//         i === todoIndex ? { ...todo, checked: !todo.checked } : todo
//       ),
//     });
//   };

//   const addTodo = () => {
//     if (
//       !editingNote ||
//       !editingTodo ||
//       editingTodo.index !== -1 ||
//       !editingTodo.text.trim()
//     )
//       return;
//     setEditingNote({
//       ...editingNote,
//       todos: [
//         ...(editingNote.todos || []),
//         { text: editingTodo.text, checked: false },
//       ],
//     });
//     setEditingTodo(null);
//   };

//   const updateTodoText = (index: number, text: string) => {
//     if (!editingNote) return;
//     setEditingNote({
//       ...editingNote,
//       todos: editingNote.todos?.map((todo, i) =>
//         i === index ? { ...todo, text } : todo
//       ),
//     });
//   };

//   const deleteTodo = (index: number) => {
//     if (!editingNote) return;
//     setEditingNote({
//       ...editingNote,
//       todos: editingNote.todos?.filter((_, i) => i !== index),
//     });
//   };

//   const colors = [
//     { value: "#ffff99", label: "Yellow" },
//     { value: "#ff9999", label: "Red" },
//     { value: "#99ff99", label: "Green" },
//     { value: "#99ccff", label: "Blue" },
//     { value: "#ffcc99", label: "Orange" },
//     { value: "#cc99ff", label: "Purple" },
//   ];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading notes...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-background p-4">
//       {/* Header */}
//       <header className="flex items-center justify-between mb-6">
//         <Button
//           variant="ghost"
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2"
//         >
//           <ArrowLeft className="h-4 w-4" />
//           Back to Boards
//         </Button>
//         <h1 className="text-2xl font-bold text-foreground">
//           Board: {boardName}
//         </h1>
//         <Button
//           onClick={() => setShowCreateModal(true)}
//           className="flex items-center gap-2"
//         >
//           <Plus className="h-4 w-4" />
//           Add Note
//         </Button>
//       </header>

//       {/* Notes Visualization */}
//       <div
//         className="relative h-[80vh] overflow-auto rounded-lg p-8"
//         style={{
//           backgroundImage:
//             'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f5f5f5" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
//         }}
//       >
//         {notes.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-full text-center">
//             <div className="bg-white/20 p-8 rounded-full">
//               <Plus className="h-12 w-12 text-muted-foreground mx-auto" />
//             </div>
//             <h3 className="text-xl font-semibold mt-4 text-muted-foreground">
//               No notes yet
//             </h3>
//             <p className="text-sm text-muted-foreground mt-2">
//               Add your first sticky note to get started!
//             </p>
//           </div>
//         ) : (
//           notes.map((note) => (
//             <div
//               key={note._id}
//               className="absolute cursor-pointer group"
//               style={{
//                 left: `${positions[note._id]?.left ?? 0}%`,
//                 top: `${positions[note._id]?.top ?? 0}%`,
//                 transform: `rotate(${positions[note._id]?.rotate ?? 0}deg)`,
//                 width: "200px",
//                 zIndex: positions[note._id]?.zIndex ?? 0,
//               }}
//               onClick={() => setEditingNote(note)}
//             >
//               <Card
//                 className="shadow-lg border-0 h-48 overflow-hidden transition-all duration-200 hover:shadow-xl group-hover:scale-105"
//                 style={{ backgroundColor: note.color }}
//               >
//                 <CardHeader className="p-3 pb-1">
//                   <CardTitle className="text-sm font-bold truncate">
//                     {note.title}
//                   </CardTitle>
//                   <CardDescription className="text-xs flex items-center gap-1">
//                     <Badge variant="secondary" className="text-xs">
//                       {note.category}
//                     </Badge>
//                     {note.priority && (
//                       <Badge
//                         variant={
//                           note.priority === "high" ? "destructive" : "default"
//                         }
//                         className="text-xs"
//                       >
//                         {note.priority}
//                       </Badge>
//                     )}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="p-3 pt-1 h-full overflow-y-auto">
//                   {note.description && (
//                     <p className="text-xs mb-2 line-clamp-3">
//                       {note.description}
//                     </p>
//                   )}
//                   {note.todos && note.todos.length > 0 && (
//                     <div className="space-y-1">
//                       {note.todos.map((todo, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center gap-2 text-xs"
//                         >
//                           <Checkbox
//                             checked={todo.checked}
//                             className="h-3 w-3"
//                           />
//                           <span className={todo.checked ? "line-through" : ""}>
//                             {todo.text}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                   {note.completionStatus && (
//                     <Badge className="mt-2 text-xs">
//                       {note.completionStatus}
//                     </Badge>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Create Note Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle>Create New Note</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Input
//                 placeholder="Title"
//                 value={newNote.title}
//                 onChange={(e) =>
//                   setNewNote({ ...newNote, title: e.target.value })
//                 }
//               />
//               <Textarea
//                 placeholder="Description"
//                 value={newNote.description}
//                 onChange={(e) =>
//                   setNewNote({ ...newNote, description: e.target.value })
//                 }
//               />
//               <Input
//                 placeholder="Category"
//                 value={newNote.category}
//                 onChange={(e) =>
//                   setNewNote({ ...newNote, category: e.target.value })
//                 }
//               />
//               <Select
//                 value={newNote.color}
//                 onValueChange={(v) => setNewNote({ ...newNote, color: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Color" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {colors.map((c) => (
//                     <SelectItem key={c.value} value={c.value}>
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-4 h-4 rounded"
//                           style={{ backgroundColor: c.value }}
//                         />
//                         {c.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={newNote.priority}
//                 onValueChange={(v) => setNewNote({ ...newNote, priority: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button onClick={handleCreateNote} className="w-full">
//                 Create
//               </Button>
//               <Button
//                 variant="ghost"
//                 onClick={() => setShowCreateModal(false)}
//                 className="w-full"
//               >
//                 Cancel
//               </Button>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Edit Note Modal */}
//       {editingNote && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
//             <CardHeader>
//               <CardTitle>Edit Note</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Input
//                 placeholder="Title"
//                 value={editingNote.title}
//                 onChange={(e) =>
//                   setEditingNote({ ...editingNote, title: e.target.value })
//                 }
//               />
//               <Textarea
//                 placeholder="Description"
//                 value={editingNote.description || ""}
//                 onChange={(e) =>
//                   setEditingNote({
//                     ...editingNote,
//                     description: e.target.value,
//                   })
//                 }
//               />
//               <Input
//                 placeholder="Category"
//                 value={editingNote.category}
//                 onChange={(e) =>
//                   setEditingNote({ ...editingNote, category: e.target.value })
//                 }
//               />
//               <Select
//                 value={editingNote.color}
//                 onValueChange={(v) =>
//                   setEditingNote({ ...editingNote, color: v })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Color" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {colors.map((c) => (
//                     <SelectItem key={c.value} value={c.value}>
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-4 h-4 rounded"
//                           style={{ backgroundColor: c.value }}
//                         />
//                         {c.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={editingNote.priority || "medium"}
//                 onValueChange={(v) =>
//                   setEditingNote({ ...editingNote, priority: v })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Select
//                 value={editingNote.completionStatus || "pending"}
//                 onValueChange={(v) =>
//                   setEditingNote({ ...editingNote, completionStatus: v })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="pending">Pending</SelectItem>
//                   <SelectItem value="in-progress">In Progress</SelectItem>
//                   <SelectItem value="completed">Completed</SelectItem>
//                 </SelectContent>
//               </Select>
//               {editingNote.todos && (
//                 <div>
//                   <h4 className="font-medium mb-2">Todos</h4>
//                   <div className="space-y-2">
//                     {editingNote.todos.map((todo, i) => (
//                       <div key={i} className="flex items-center gap-2">
//                         <Checkbox
//                           checked={todo.checked}
//                           onCheckedChange={() => toggleTodo(i)}
//                         />
//                         <Input
//                           value={todo.text}
//                           onChange={(e) => updateTodoText(i, e.target.value)}
//                           className="flex-1"
//                         />
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => deleteTodo(i)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     ))}
//                     <div className="flex gap-2">
//                       <Input
//                         placeholder="Add new todo"
//                         value={editingTodo?.text || ""}
//                         onChange={(e) =>
//                           setEditingTodo({ index: -1, text: e.target.value })
//                         }
//                         onKeyDown={(e) => {
//                           if (
//                             e.key === "Enter" &&
//                             editingTodo &&
//                             editingTodo.text.trim()
//                           ) {
//                             addTodo();
//                           }
//                         }}
//                       />
//                       <Button
//                         size="sm"
//                         onClick={() => {
//                           if (editingTodo && editingTodo.text.trim()) {
//                             addTodo();
//                           }
//                         }}
//                       >
//                         Add
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className="flex gap-2 pt-4">
//                 <Button onClick={handleUpdateNote} className="flex-1">
//                   Update
//                 </Button>
//                 <Button
//                   variant="destructive"
//                   onClick={() => handleDeleteNote(editingNote._id)}
//                   className="flex-1"
//                 >
//                   Delete
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   onClick={() => setEditingNote(null)}
//                   className="flex-1"
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BoardVisualization;
