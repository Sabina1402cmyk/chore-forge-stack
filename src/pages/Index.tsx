import { useBoards } from "@/hooks/useBoards";
import { BoardCard } from "@/components/BoardCard";
import { CreateBoardDialog } from "@/components/CreateBoardDialog";
import { KanbanSquare, Plus } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { boards, createBoard, deleteBoard } = useBoards();

  const handleCreateBoard = (title: string, description?: string) => {
    createBoard(title, description);
    toast.success("Доска создана!");
  };

  const handleDeleteBoard = (boardId: string) => {
    deleteBoard(boardId);
    toast.success("Доска удалена!");
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <KanbanSquare className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Доски задач
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Организуйте свои проекты и задачи с помощью современных досок в стиле Kanban
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <CreateBoardDialog onCreateBoard={handleCreateBoard} />
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16">
            <KanbanSquare className="h-24 w-24 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">Начните с создания доски</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Создайте свою первую доску для управления задачами и проектами
            </p>
            <CreateBoardDialog onCreateBoard={handleCreateBoard} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map(board => (
              <BoardCard
                key={board.id}
                board={board}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
