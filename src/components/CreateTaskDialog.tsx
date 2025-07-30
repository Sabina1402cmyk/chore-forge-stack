import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface CreateTaskDialogProps {
  onCreateTask: (title: string, description?: string) => void;
}

export const CreateTaskDialog = ({ onCreateTask }: CreateTaskDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreateTask(title.trim(), description.trim() || undefined);
      setTitle("");
      setDescription("");
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 backdrop-blur-glass">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-foreground">Создать новую задачу</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Добавьте новую задачу в колонку
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-foreground">Название задачи</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Введите название задачи"
                className="border-border bg-background/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description" className="text-foreground">Описание (необязательно)</Label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание задачи"
                className="border-border bg-background/50 resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className="bg-gradient-primary border-0">
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Add displayName for identification in DroppableColumn
CreateTaskDialog.displayName = 'CreateTaskDialog';