import Board from "../models/boardModel.js";
import asyncHandler from "../middleware/asyncHandler.js";
import mongoose from "mongoose";


// @desc    Create board for each user
// @route   POST '/api/boards/'
// @access  private
const createBoard = asyncHandler(async (req, res, next) => {
  const { board } = req.body;
  // If User already has board. Find by user id and update it
  const userBoardExists = await Board.findOneAndUpdate({ user: req.user }, { $push: { 'boards': board } }, { new: true });
  // Else create new board for new user
  if (!userBoardExists) {
    const newBoard = await Board.create({ boards: board, user: req.user });
    await newBoard.save();
    res.json(newBoard);
    return;
  }
  res.json(userBoardExists);
});

// @desc    Delete board
// @route   Delete '/api/boards/:boardId'
// @access  private
const deleteBoard = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  const boardToDelete = await Board.findOne({ user: req.user._id });
  if (!boardToDelete) {
    throw new Error('No Board Found');
  }

  const { boards } = boardToDelete;
  boardToDelete.boards = boards.filter(board => board._id.toString() !== boardId);

  // Save back to db
  boardToDelete.save();

  res.json(boardToDelete);
});


// @desc    Get all boards
// @route   GET '/api/boards/'
// @access  private
const getAllBoards = asyncHandler(async (req, res, next) => {
  // const { userId } = req.body;
  const allBoards = await Board.findOne({ user: req.user._id });

  if (!allBoards) {
    throw new Error('No Boards Found');
  }

  res.json(allBoards);
});


// @desc    Add a new column to board/Update already column exists
// @route   POST '/api/boards/:boardId/add-column'
// @access  private
const addNewColumn = asyncHandler(async (req, res, next) => {
  const { boardId } = req.params;
  const { columns } = req.body;

  const userBoards = await Board.findOne({ user: req.user._id });
  if (!userBoards) {
    throw new Error('No Board Found');
  }

  const { boards } = userBoards;
  const board = boards.filter(board => board._id.toString() === boardId);

  const cols = board.flatMap(b => b.columns);
  // console.log(allCols);

  for (const { column } of columns) {
    const existingColumnIndex = cols.findIndex(col => col.name === column.name);
    if (existingColumnIndex !== -1) {
      cols[ existingColumnIndex ].tasks.push(...column.tasks);
    } else {
      cols.push(column);
    }
  }

  board[ 0 ].columns = cols;

  await userBoards.save();

  res.json(board);
  // }
});


// @desc    Update tasks/Add new task
// @route   POST '/api/boards/:boardId/columns/:columnId/tasks/:taskId'
// @access  private
const updateTasks = asyncHandler(async (req, res, next) => {
  const { boardId, columnId, taskId } = req.params;
  const { task, isNewTask } = req.body;
  // Find Board by user id;
  const boardToUpdate = await Board.findOne({ user: req.user._id });
  if (!boardToUpdate) {
    throw new Error('No Board Found');
  }

  const { boards } = boardToUpdate;
  const board = boards.filter(board => board._id.toString() === boardId);

  // Take out the task that is to be updated
  const columns = board.flatMap(board => board.columns).filter(column => column._id);
  if (!columns) {
    throw new Error('No Column Found');
  }

  // Get Column with the provided columnId
  const column = columns.filter(column => column._id.toString() === columnId);
  const tasks = column[ 0 ].tasks;

  if (isNewTask) {
    // Add new task 
    const newTask = { ...task, _id: new mongoose.Types.ObjectId() };
    tasks.push(newTask);
  } else {
    // Find the task to be updated
    const existingTask = tasks.find(existingTask => existingTask._id.toString() === taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }
    // Update task
    Object.assign(existingTask, task);
  }

  // Save it back to DB
  boardToUpdate.markModified('boards');
  await boardToUpdate.save();

  res.json(board);
});


// @desc    Delete task
// @route   DELETE '/api/boards/:boardId/columns/:columnId/tasks/:taskId'
// @access  private
const deleteTask = asyncHandler(async (req, res, next) => {
  const { boardId, columnId, taskId } = req.params;
  const boardToUpdate = await Board.findOne({ user: req.user._id });
  if (!boardToUpdate) {
    throw new Error('No Board Found');
  }

  const { boards } = boardToUpdate;
  const board = boards.filter(board => board._id.toString() === boardId);

  // Take out the task that is to be updated
  const columns = board.flatMap(board => board.columns).filter(column => column._id);
  if (!columns) {
    throw new Error('No Column Found');
  }

  // Get Column with the provided columnId
  const column = columns.filter(column => column._id.toString() === columnId);
  const tasks = column[ 0 ].tasks;
  const filteredTasks = tasks.filter(task => task._id.toString() !== taskId);

  // update column
  column[ 0 ].tasks = filteredTasks;

  // Save it back to DB
  boardToUpdate.markModified('boards');
  await boardToUpdate.save();

  res.json(column);
});


export { createBoard, addNewColumn, getAllBoards, updateTasks, deleteTask, deleteBoard };
