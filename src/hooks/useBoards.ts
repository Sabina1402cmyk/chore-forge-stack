import { useState, useEffect } from 'react';
import { Board, Task, TaskStatus } from '@/types/board';

const STORAGE_KEY = 'trello-boards';

export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const savedBoards = localStorage.getItem(STORAGE_KEY);
    if (savedBoards) {
      setBoards(JSON.parse(savedBoards).map((board: any) => ({
        ...board,
        createdAt: new Date(board.createdAt),
        updatedAt: new Date(board.updatedAt),
        tasks: board.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }))
      })));
    }
  }, []);

  const saveBoards = (newBoards: Board[]) => {
    setBoards(newBoards);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBoards));
  };

  const createBoard = (title: string, description?: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      title,
      description,
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    saveBoards([...boards, newBoard]);
    return newBoard;
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    const updatedBoards = boards.map(board =>
      board.id === boardId
        ? { ...board, ...updates, updatedAt: new Date() }
        : board
    );
    saveBoards(updatedBoards);
  };

  const deleteBoard = (boardId: string) => {
    saveBoards(boards.filter(board => board.id !== boardId));
  };

  const createTask = (boardId: string, title: string, description?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedBoards = boards.map(board =>
      board.id === boardId
        ? {
            ...board,
            tasks: [...board.tasks, newTask],
            updatedAt: new Date()
          }
        : board
    );
    saveBoards(updatedBoards);
    return newTask;
  };

  const updateTask = (boardId: string, taskId: string, updates: Partial<Task>) => {
    const updatedBoards = boards.map(board =>
      board.id === boardId
        ? {
            ...board,
            tasks: board.tasks.map(task =>
              task.id === taskId
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            ),
            updatedAt: new Date()
          }
        : board
    );
    saveBoards(updatedBoards);
  };

  const deleteTask = (boardId: string, taskId: string) => {
    const updatedBoards = boards.map(board =>
      board.id === boardId
        ? {
            ...board,
            tasks: board.tasks.filter(task => task.id !== taskId),
            updatedAt: new Date()
          }
        : board
    );
    saveBoards(updatedBoards);
  };

  const moveTask = (boardId: string, taskId: string, newStatus: TaskStatus) => {
    updateTask(boardId, taskId, { status: newStatus });
  };

  return {
    boards,
    createBoard,
    updateBoard,
    deleteBoard,
    createTask,
    updateTask,
    deleteTask,
    moveTask
  };
};