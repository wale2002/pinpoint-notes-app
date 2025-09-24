import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { noteAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CreateNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteCreated: () => void;
  boardName: string;
}

const colorOptions = [
  { value: '#ffeb3b', label: 'Yellow', class: 'bg-sticky-yellow' },
  { value: '#e91e63', label: 'Pink', class: 'bg-sticky-pink' },
  { value: '#2196f3', label: 'Blue', class: 'bg-sticky-blue' },
  { value: '#4caf50', label: 'Green', class: 'bg-sticky-green' },
  { value: '#ff9800', label: 'Orange', class: 'bg-sticky-orange' },
  { value: '#9c27b0', label: 'Purple', class: 'bg-sticky-purple' },
];

const categoryOptions = [
  'To-Do',
  'In Progress',
  'Completed',
  'Ideas',
  'Notes',
  'Reminders',
];

const priorityOptions = [
  'Low',
  'Medium',
  'High',
  'Urgent',
];

const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({
  isOpen,
  onClose,
  onNoteCreated,
  boardName,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'To-Do',
    color: '#ffeb3b',
    priority: '',
    completionStatus: '',
  });
  const [todos, setTodos] = useState<Array<{ text: string; checked: boolean }>>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Note title is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await noteAPI.create({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        color: formData.color,
        boardId: boardName, // Use boardName as boardId
        todos: todos.length > 0 ? todos : undefined,
        priority: formData.priority || undefined,
        completionStatus: formData.completionStatus || undefined,
      });
      
      toast({
        title: "Success!",
        description: "Note created successfully"
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'To-Do',
        color: '#ffeb3b',
        priority: '',
        completionStatus: '',
      });
      setTodos([]);
      setNewTodo('');
      
      onNoteCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create note",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, { text: newTodo.trim(), checked: false }]);
      setNewTodo('');
    }
  };

  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleTodo = (index: number) => {
    setTodos(prev => prev.map((todo, i) => 
      i === index ? { ...todo, checked: !todo.checked } : todo
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new sticky note to {boardName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter note title..."
              required
            />
          </div>

          {/* Category and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color *</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => handleInputChange('color', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.class}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(priority => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={formData.completionStatus}
                onChange={(e) => handleInputChange('completionStatus', e.target.value)}
                placeholder="e.g., Draft, Review..."
              />
            </div>
          </div>

          {/* Todos */}
          <div className="space-y-2">
            <Label>To-Do Items</Label>
            <div className="flex gap-2">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a to-do item..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTodo())}
              />
              <Button type="button" onClick={addTodo} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {todos.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {todos.map((todo, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <input
                      type="checkbox"
                      checked={todo.checked}
                      onChange={() => toggleTodo(index)}
                      className="rounded"
                    />
                    <span className={`flex-1 text-sm ${todo.checked ? 'line-through opacity-60' : ''}`}>
                      {todo.text}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTodo(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;