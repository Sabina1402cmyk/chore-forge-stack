import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, List, Trash2 } from "lucide-react";
import { Board } from "@/types/board";
import { useNavigate } from "react-router-dom";

interface BoardCardProps {
  board: Board;
  onDelete: (boardId: string) => void;
}

export const BoardCard = ({ board, onDelete }: BoardCardProps) => {
  const navigate = useNavigate();

  const taskCounts = {
    todo: board.tasks.filter(task => task.status === 'todo').length,
    inProgress: board.tasks.filter(task => task.status === 'in-progress').length,
    done: board.tasks.filter(task => task.status === 'done').length
  };

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 bg-gradient-card border-0 backdrop-blur-glass">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1" onClick={() => navigate(`/board/${board.id}`)}>
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {board.title}
            </CardTitle>
            {board.description && (
              <CardDescription className="mt-1 text-sm text-muted-foreground">
                {board.description}
              </CardDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(board.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent onClick={() => navigate(`/board/${board.id}`)}>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <List className="h-4 w-4" />
            <span>{board.tasks.length} задач</span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {taskCounts.todo} к выполнению
            </Badge>
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
              {taskCounts.inProgress} в работе
            </Badge>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              {taskCounts.done} выполнено
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Создано {board.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};