import React, { useState } from 'react';
import { motion } from "framer-motion";

export const TodoItem = ({ todo, onDelete, onEdit, onToggleDone }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDesc, setEditedDesc] = useState(todo.desc);
  const [editedTime, setEditedTime] = useState(todo.time || "");
  const [editedPriority, setEditedPriority] = useState(todo.priority || "High");

  const handleSave = () => {
    onEdit({ ...todo, title: editedTitle, desc: editedDesc, time: editedTime, priority: editedPriority });
    setIsEditing(false);
  };

  const textStyle = {
    textDecoration: todo.done ? 'line-through' : 'none',
    color: todo.done ? 'gray' : 'black'
  };

  const now = new Date();
  const nowTime = new Date(`1970-01-01T${now.toTimeString().slice(0, 5)}:00`);
  const todoTime = todo.time ? new Date(`1970-01-01T${todo.time}:00`) : null;

  const isDelayed = !todo.done && todoTime && todoTime < nowTime;


  return (
    <>
      <div className="card my-2 p-3">
        {isEditing ? (
          <>
            <input
              type="text"
              className="form-control my-1"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <input
              type="text"
              className="form-control my-1"
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
            />
            <div className="row my-2">
              <div className="col-md-6">
                <input type="time" className="form-control" value={editedTime} onChange={(e) => setEditedTime(e.target.value)} />
              </div>
              <div className="col-md-6">
                <select className="form-select" value={editedPriority} onChange={(e) => setEditedPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
            <div className="mt-2">
              <button className="btn btn-sm btn-success me-2" onClick={handleSave}>Save</button>
              <button className="btn btn-sm btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>

          </>
        ) : (
          <>
            <h4 style={textStyle}>{
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <li className={`list-group-item ${todo.done ? 'completed' : ''}`}>
                  {todo.title}
                </li>
              </motion.div>}</h4>
            <p style={textStyle}>{todo.desc}</p>
            <p style={textStyle}><strong>Time:</strong> {todo.time || "Not Set"}</p>
            <p style={textStyle}><strong>Priority:</strong> {todo.priority || "High"}</p>
            {/* Status badges */}
            {isDelayed && (
              <span className="badge bg-danger me-2">Delayed</span>
            )}
            {todo.done && (
              <span className="badge bg-success me-2">Completed</span>
            )}

            {/* Action buttons */}
            <div className="mt-2">
              <button className="btn btn-sm btn-success me-2" onClick={() => onToggleDone(todo)}>
                {todo.done ? "Undo" : "Done"}
              </button>
              <button className="btn btn-sm btn-primary me-2" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(todo)}>Delete</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
