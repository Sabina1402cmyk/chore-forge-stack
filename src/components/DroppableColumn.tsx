import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatus } from "@/types/board";

interface DroppableColumnProps {
  id: TaskStatus;
  title: string;
  children: React.ReactNode;
  taskCount: number;
}

export const DroppableColumn = ({ id, title, children, taskCount }: DroppableColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Card 
      ref={setNodeRef}
      className={`flex-1 bg-column-bg border-0 shadow-soft transition-all duration-200 ${
        isOver ? 'ring-2 ring-primary/50 bg-accent/50' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
          <span>{title}</span>
          <span className="text-xs font-normal text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
            {taskCount}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {children}
      </CardContent>
    </Card>
  );
};