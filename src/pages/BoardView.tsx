import { useParams, useNavigate } from "react-router-dom";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent, closestCorners, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useBoards } from "@/hooks/useBoards";
import { TaskCard } from "@/components/TaskCard";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { DroppableColumn } from "@/components/DroppableColumn";
import { AIAssistant } from "@/components/AIAssistant";
import { Task, TaskStatus, TASK_STATUSES } from "@/types/board";
import { toast } from "sonner";

export const BoardView = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards, createTask, updateTask, deleteTask, moveTask } = useBoards();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const board = boards.find(b => b.id === boardId);

  if (!board) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доска не найдена</h1>
          <Button onClick={() => navigate("/")} className="bg-gradient-primary border-0">
            Вернуться к доскам
          </Button>
        </div>
      </div>
    );
  }

  const tasksByStatus = {
    todo: board.tasks.filter(task => task.status === 'todo'),
    'in-progress': board.tasks.filter(task => task.status === 'in-progress'),
    done: board.tasks.filter(task => task.status === 'done')
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = board.tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If we're over a column, that's fine
    if (['todo', 'in-progress', 'done'].includes(overId)) return;

    // If we're over another task, find its column
    const activeTask = board.tasks.find(t => t.id === activeId);
    const overTask = board.tasks.find(t => t.id === overId);

    if (!activeTask || !overTask) return;
    if (activeTask.status === overTask.status) return;

    // Move the task to the new column
    moveTask(board.id, activeId, overTask.status);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // If dropped on a column
    if (['todo', 'in-progress', 'done'].includes(overId)) {
      const newStatus = overId as TaskStatus;
      const task = board.tasks.find(t => t.id === taskId);
      if (task && task.status !== newStatus) {
        moveTask(board.id, taskId, newStatus);
        toast.success("Задача перемещена!");
      }
    }
  };

  const handleCreateTask = (status: TaskStatus) => (title: string, description?: string) => {
    const task = createTask(board.id, title, description);
    if (task && status !== 'todo') {
      moveTask(board.id, task.id, status);
    }
    toast.success("Задача создана!");
  };

  const handleEditTask = (taskId: string, title: string, description?: string) => {
    updateTask(board.id, taskId, { title, description });
    toast.success("Задача обновлена!");
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(board.id, taskId);
    toast.success("Задача удалена!");
  };

  const handleCreateSprint = (sprintTasks: Task[]) => {
    // Перемещаем задачи в колонку "В работе"
    sprintTasks.forEach(task => {
      if (task.status === 'todo') {
        moveTask(board.id, task.id, 'in-progress');
      }
    });
  };

  const renderColumn = (status: TaskStatus) => {
    const tasks = tasksByStatus[status];
    const statusInfo = TASK_STATUSES[status];

    return (
      <DroppableColumn
        key={status}
        id={status}
        title={statusInfo.label}
        taskCount={tasks.length}
        createTaskButton={<CreateTaskDialog onCreateTask={handleCreateTask(status)} />}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 min-h-[200px]">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </SortableContext>
      </DroppableColumn>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к доскам
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">{board.title}</h1>
          {board.description && (
            <p className="text-muted-foreground">{board.description}</p>
          )}
        </div>

        <div className="mb-6">
          <AIAssistant 
            tasks={board.tasks} 
            onCreateSprint={handleCreateSprint}
          />
        </div>

        <DndContext
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(TASK_STATUSES) as TaskStatus[]).map(renderColumn)}
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};