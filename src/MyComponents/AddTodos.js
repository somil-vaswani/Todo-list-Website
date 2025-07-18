import React, { useState } from 'react';

export const AddTodos = (props) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [time, setTime] = useState("");
    const [priority, setPriority] = useState("High");

    const submit = (e) => {
        e.preventDefault();
        if (!title || !desc || !time) {
            alert("All fields are required");
            return;
        }
        props.addTodo(title, desc, time, priority);
        setTitle("");
        setDesc("");
        setTime("");
    }

    return (
        <div className="container my-3">
            <h3 className="text-center">Add a Todo</h3>
            <form onSubmit={submit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Todo Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" id="title" />
                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Todo Description</label>
                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="form-control" id="desc" />
                </div>
                <div className="row my-2">
                    <div className="col-md-6">
                        <label htmlFor="time" className="form-label">Time</label>
                        <input type="time" className="form-control" id="time" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="priority" className="form-label">Priority</label>
                        <select className="form-select" id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-sm btn-success">Add Todo</button>
            </form>
        </div>
    );
}

export default AddTodos
