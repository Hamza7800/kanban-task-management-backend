import express from 'express';
import { addNewColumn, createBoard, getAllBoards, updateTasks, deleteTask, deleteBoard } from "../controllers/boardsController.js";

const router = express.Router();

router
  .get('/', getAllBoards)
  .post('/', createBoard);
router.delete('/:boardId', deleteBoard);
router.put('/:boardId/add-column', addNewColumn);
router.put('/:boardId/columns/:columnId/tasks/:taskId', updateTasks);
router.delete('/:boardId/columns/:columnId/tasks/:taskId', deleteTask);

export default router;
