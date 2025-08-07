import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Brain } from 'lucide-react';
import { AIAssistant } from './AIAssistant';
import { Task } from '@/types/board';

interface FloatingAIButtonProps {
  tasks: Task[];
  onCreateSprint?: (sprintTasks: Task[]) => void;
}

export const FloatingAIButton = ({ tasks, onCreateSprint }: FloatingAIButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-primary hover:shadow-xl transition-all duration-300 hover:scale-105 z-50"
        >
          <Brain className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Помощник
          </DialogTitle>
        </DialogHeader>
        <AIAssistant 
          tasks={tasks} 
          onCreateSprint={(sprintTasks) => {
            onCreateSprint?.(sprintTasks);
            setIsOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};