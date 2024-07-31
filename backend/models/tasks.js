const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  newTask: String,
  dueDate: Date,
  checked: Boolean
});

const TaskModel = mongoose.model("tasks", TaskSchema);
module.exports = TaskModel;
