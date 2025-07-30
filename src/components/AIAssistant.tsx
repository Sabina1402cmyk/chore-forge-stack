import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Send, Filter, TrendingUp } from 'lucide-react';
import { Task, TaskPriority, TASK_PRIORITIES, TASK_STATUSES } from '@/types/board';
import { toast } from 'sonner';

interface AIAssistantProps {
  tasks: Task[];
  onCreateSprint?: (sprintTasks: Task[]) => void;
}

interface SprintRecommendation {
  tasks: Task[];
  totalHours: number;
  priorityDistribution: Record<TaskPriority, number>;
  reasoning: string;
}

export const AIAssistant = ({ tasks, onCreateSprint }: AIAssistantProps) => {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<SprintRecommendation | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const analyzeTasksForSprint = (availableTasks: Task[], maxHours: number = 40): SprintRecommendation => {
    // Фильтруем только задачи в беклоге (todo)
    const backlogTasks = availableTasks.filter(task => task.status === 'todo');
    
    // Сортируем по приоритету и времени
    const sortedTasks = backlogTasks.sort((a, b) => {
      const priorityDiff = TASK_PRIORITIES[b.priority].weight - TASK_PRIORITIES[a.priority].weight;
      if (priorityDiff !== 0) return priorityDiff;
      
      // При равном приоритете выбираем задачи с меньшей оценкой времени
      return (a.estimatedHours || 0) - (b.estimatedHours || 0);
    });

    // Формируем спринт с учетом лимита времени
    const sprintTasks: Task[] = [];
    let totalHours = 0;
    const priorityDistribution: Record<TaskPriority, number> = {
      low: 0, medium: 0, high: 0, critical: 0
    };

    for (const task of sortedTasks) {
      const taskHours = task.estimatedHours || 2; // По умолчанию 2 часа
      
      if (totalHours + taskHours <= maxHours) {
        sprintTasks.push(task);
        totalHours += taskHours;
        priorityDistribution[task.priority]++;
      }
    }

    const reasoning = `
Рекомендация основана на следующих критериях:
• Приоритизация задач по важности (критические → высокие → средние → низкие)
• Оптимизация загрузки в рамках ${maxHours} часов
• Балансировка между сложностью и количеством задач
• Всего задач в спринте: ${sprintTasks.length}
• Общая нагрузка: ${totalHours} часов из ${maxHours} доступных
    `.trim();

    return {
      tasks: sprintTasks,
      totalHours,
      priorityDistribution,
      reasoning
    };
  };

  const findTasksByQuery = (searchQuery: string): Task[] => {
    const query = searchQuery.toLowerCase();
    
    return tasks.filter(task => {
      const titleMatch = task.title.toLowerCase().includes(query);
      const descriptionMatch = task.description?.toLowerCase().includes(query);
      const statusMatch = TASK_STATUSES[task.status].label.toLowerCase().includes(query);
      const priorityMatch = TASK_PRIORITIES[task.priority].label.toLowerCase().includes(query);
      const assigneeMatch = task.assignee?.toLowerCase().includes(query);
      
      return titleMatch || descriptionMatch || statusMatch || priorityMatch || assigneeMatch;
    });
  };

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация AI анализа
      
      if (query.toLowerCase().includes('спринт') || query.toLowerCase().includes('sprint')) {
        const recommendation = analyzeTasksForSprint(tasks);
        setRecommendation(recommendation);
        setFilteredTasks([]);
        toast.success('Спринт сформирован на основе анализа задач');
      } else {
        const foundTasks = findTasksByQuery(query);
        setFilteredTasks(foundTasks);
        setRecommendation(null);
        toast.success(`Найдено задач: ${foundTasks.length}`);
      }
    } catch (error) {
      toast.error('Ошибка при анализе задач');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateSprint = () => {
    if (recommendation && onCreateSprint) {
      onCreateSprint(recommendation.tasks);
      toast.success('Спринт создан!');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Помощник
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Например: 'Сформируй оптимальный спринт из беклога'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <Button 
            onClick={handleQuery} 
            disabled={isAnalyzing}
            size="icon"
          >
            {isAnalyzing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {recommendation && (
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Рекомендация спринта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={recommendation.reasoning}
                readOnly
                className="min-h-[100px] bg-background/50"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Распределение по приоритетам:</h4>
                  <div className="space-y-1">
                    {Object.entries(recommendation.priorityDistribution).map(([priority, count]) => (
                      count > 0 && (
                        <div key={priority} className="flex items-center justify-between">
                          <Badge variant="secondary" className={TASK_PRIORITIES[priority as TaskPriority].color}>
                            {TASK_PRIORITIES[priority as TaskPriority].label}
                          </Badge>
                          <span className="text-sm">{count} задач</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Статистика:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Всего задач:</span>
                      <span>{recommendation.tasks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Общее время:</span>
                      <span>{recommendation.totalHours}ч</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleCreateSprint}
                className="w-full"
                variant="default"
              >
                Создать спринт из {recommendation.tasks.length} задач
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Найденные задачи ({filteredTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {task.assignee && <span>Исполнитель: {task.assignee} | </span>}
                        {task.estimatedHours && <span>{task.estimatedHours}ч</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className={TASK_STATUSES[task.status].color}>
                        {TASK_STATUSES[task.status].label}
                      </Badge>
                      <Badge variant="secondary" className={TASK_PRIORITIES[task.priority].color}>
                        {TASK_PRIORITIES[task.priority].label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};