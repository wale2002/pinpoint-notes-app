import React from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Edit3 } from 'lucide-react';
import { Button } from './button';

interface StickyNoteProps {
  title: string;
  description?: string;
  category: string;
  color: string;
  priority?: string;
  completionStatus?: string;
  todos?: Array<{ text: string; checked: boolean }>;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

const colorMap: Record<string, string> = {
  '#ffeb3b': 'bg-sticky-yellow',
  '#e91e63': 'bg-sticky-pink',
  '#2196f3': 'bg-sticky-blue',
  '#4caf50': 'bg-sticky-green',
  '#ff9800': 'bg-sticky-orange',
  '#9c27b0': 'bg-sticky-purple',
};

export const StickyNote: React.FC<StickyNoteProps> = ({
  title,
  description,
  category,
  color,
  priority,
  completionStatus,
  todos = [],
  onEdit,
  onDelete,
  className,
}) => {
  const bgColor = colorMap[color] || 'bg-sticky-yellow';

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg shadow-sticky transform transition-all duration-200 hover:scale-105 hover:shadow-hover',
        'min-h-[200px] w-full max-w-sm',
        bgColor,
        className
      )}
    >
      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-6 w-6 p-0 hover:bg-black/10"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        )}
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-600"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-800 leading-tight">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium bg-black/10 px-2 py-1 rounded-full">
              {category}
            </span>
            {priority && (
              <span className="text-xs font-medium bg-black/10 px-2 py-1 rounded-full">
                {priority}
              </span>
            )}
          </div>
        </div>

        {description && (
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        )}

        {todos.length > 0 && (
          <div className="space-y-1">
            {todos.map((todo, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.checked}
                  readOnly
                  className="rounded text-primary"
                />
                <span className={cn("text-sm", todo.checked && "line-through opacity-60")}>
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {completionStatus && (
          <div className="mt-auto">
            <span className="text-xs font-medium bg-black/10 px-2 py-1 rounded-full">
              Status: {completionStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};