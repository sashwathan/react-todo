const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TaskModel = require("./models/tasks");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/todoapp')
  .then(() => console.log('Connected to MongoDB'));

app.post("/createTask", (req, res) => {
  TaskModel.create(req.body)
    .then(task => res.json(task))
    .catch(err => res.json(err));
});

app.get('/getTask', (req, res) => {
  TaskModel.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.json(err));
});

app.put('/updateTask/:id', (req, res) => {
  const taskId = req.params.id;
  const { newTask, dueDate, checked } = req.body;

  TaskModel.findByIdAndUpdate(taskId, { newTask, dueDate, checked }, { new: true })
    .then(updatedTask => res.json(updatedTask))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.delete('/deleteTask/:id', (req, res) => {
  const taskId = req.params.id;

  TaskModel.findByIdAndDelete(taskId)
    .then(() => res.json({ message: 'Task deleted successfully' }))
    .catch(err => res.status(400).json({ error: err.message }));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
