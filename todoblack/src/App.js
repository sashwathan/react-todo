import "./App.css";
import { useEffect, useState } from "react";
import { Task } from "./Task";
import axios from 'axios';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [checked, setChecked] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/getTask')
      .then(result => setTodoList(result.data))
      .catch(err => console.log(err));
  }, []);

  const handleChangeTask = (event) => {
    setNewTask(event.target.value);
  };

  const handleChangeDueDate = (event) => {
    setDueDate(event.target.value);
  };

  const handleChecked = (event) => {
    setChecked(event.target.checked);
  };

  const formatDateString = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const addOrUpdateTask = () => {
    if (editTaskId !== null) {
      const updatedTask = {
        newTask: newTask,
        dueDate: dueDate,
        checked: checked,
      };

      axios.put(`http://localhost:3001/updateTask/${editTaskId}`, updatedTask)
        .then(() => {
          setTodoList(todoList.map(task =>
            task._id === editTaskId ? { ...task, newTask: newTask, dueDate: dueDate, checked: checked } : task
          ));
          setEditTaskId(null);
        })
        .catch(err => console.log(err));
    } else {
      const task = {
        newTask: newTask,
        dueDate: dueDate,
        checked: checked,
      };

      axios.post("http://localhost:3001/createTask", task)
        .then((response) => {
          setTodoList([...todoList, response.data]);
        })
        .catch(err => console.log(err));
    }

    setShowForm(false);
    setNewTask("");
    setDueDate("");
  };

  const editTask = (id) => {
    const task = todoList.find((task) => task._id === id);
    setNewTask(task.newTask);
    setDueDate(task.dueDate);
    setChecked(task.checked);
    setEditTaskId(id);
    setShowForm(true);
  };

  return (
    <div className="App">
      <div className="addTask">
        {!showForm && (
          <button className="addTaskButton" onClick={() => setShowForm(true)}>Add Task</button>
        )}
        {showForm && (
          <div className="form">
            <input
              type="text"
              placeholder="Task Description"
              value={newTask}
              onChange={handleChangeTask}
            />
            <input
              type="date"
              placeholder="Due Date"
              value={dueDate}
              onChange={handleChangeDueDate}
            />
            <button onClick={addOrUpdateTask}>{editTaskId !== null ? "Update Task" : "Add Task"}</button>
          </div>
        )}
      </div>
      <div className="list">
        {todoList.map((task) => {
          return (
            <Task
              key={`${task._id}`}
              newTask={task.newTask}
              dueDate={formatDateString(task.dueDate)}
              id={`${task._id}`}
              checked={task.checked}
              handleChecked={handleChecked}
              deleteTask={() => {
                axios.delete(`http://localhost:3001/deleteTask/${task._id}`)
                  .then(() => {
                    setTodoList(todoList.filter((t) => t._id !== task._id));
                  })
                  .catch(err => console.log(err));
              }}
              completeTask={() => {
                axios.put(`http://localhost:3001/updateTask/${task._id}`, { ...task, checked: true })
                  .then(() => {
                    setTodoList(todoList.map((t) =>
                      t._id === task._id ? { ...t, checked: true } : t
                    ));
                  })
                  .catch(err => console.log(err));
              }}
              editTask={() => editTask(task._id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
