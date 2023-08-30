import express from 'express';
import { addNewColumn, createBoard, getAllBoards, updateTasks, deleteTask, deleteBoard } from "../controllers/boardsController.js";
import { protect } from '../middleware/protectMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAllBoards)
  .post(protect, createBoard);
router
  .route('/:boardId')
  .delete(protect, deleteBoard);
router
  .route('/:boardId/add-column')
  .put(protect, addNewColumn);
router
  .route('/:boardId/columns/:columnId/tasks/:taskId')
  .put(protect, updateTasks);
router
  .route('/:boardId/columns/:columnId/tasks/:taskId')
  .delete(protect, deleteTask);

export default router;
