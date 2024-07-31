export const Task = (props) => {
  return (
    <div className={`task ${props.checked ? "completed" : ""}`}>
      <h1>{props.newTask}</h1>
      <p>Due Date: {props.dueDate}</p>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.handleChecked}
      />
      <button onClick={() => props.completeTask(props.id)}>Complete</button>
      <button onClick={() => props.deleteTask(props.id)}>X</button>
      <button onClick={() => props.editTask(props.id)}>Edit</button>
    </div>
  );
};
