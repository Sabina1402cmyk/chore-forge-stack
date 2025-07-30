import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { Task, TASK_STATUSES } from "@/types/board";
import { EditTaskDialog } from "./EditTaskDialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string, title: string, description?: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group cursor-grab transition-all duration-200 hover:shadow-medium bg-task-bg border-0 shadow-soft ${
          isDragging ? 'opacity-50 rotate-3 scale-105' : ''
        }`}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-foreground text-sm leading-relaxed flex-1">
                {task.title}
              </h4>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditOpen(true);
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {task.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className={`text-xs ${TASK_STATUSES[task.status].color}`}
              >
                {TASK_STATUSES[task.status].label}
              </Badge>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{task.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTaskDialog
        task={task}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={(title, description) => {
          onEdit(task.id, title, description);
          setIsEditOpen(false);
        }}
      />
    </>
  );
};