import mongoose from 'mongoose';


const subtaskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
});

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  subtasks: [ subtaskSchema ]
});

const columnSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: [ taskSchema ]
});

const board = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  columns: [ columnSchema ]
});

const boardSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  boards: [ board ],
});


const Board = mongoose.model('Board', boardSchema);

export default Board;