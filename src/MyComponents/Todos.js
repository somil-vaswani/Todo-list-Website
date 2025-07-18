import { TodoItem } from './TodoItem'

export default function Todos(props) {
  return (
    <div className="container">
      <h3 className="my-3 text-center">Todos List</h3>

      {props.todos.length === 0 ? (
        <p className="text-center">No Todos to display</p>
      ) : (
        <>
          {props.todos.map((todo) => (
            <TodoItem
              key={todo.sno}
              todo={todo}
              onDelete={props.onDelete}
              onToggleDone={props.onToggleDone}
              onEdit={props.onEdit}
            />
          ))}

          {/* Clear List button shown only when todos exist */}
          <div className="text-end mt-3">
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all todos?")) {
                  props.clearAllTodos();
                }
              }}
            >
              Clear List
            </button>
          </div>
        </>
      )}
    </div>
  );
}
