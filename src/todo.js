import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Todo.css";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);

  const [edittitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const apiUrl = "https://backend-cp2w.onrender.com";

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res));
  };

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description, _id: Date.now() }]);
            setMessage("Item added successfully");
            setTimeout(() => setMessage(""), 3000);
            setTitle("");
            setDescription("");
          } else setError("Unable to create Todo item");
        })
        .catch(() => setError("Unable to create Todo item"));
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (edittitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiUrl + "/todos/" + editId, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: edittitle, description: editdescription }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos(
              todos.map((item) =>
                item._id === editId ? { ...item, title: edittitle, description: editdescription } : item
              )
            );
            setMessage("Item updated successfully");
            setTimeout(() => setMessage(""), 3000);
            setEditId(-1);
          } else setError("Unable to update Todo item");
        })
        .catch(() => setError("Unable to update Todo item"));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(apiUrl + "/todos/" + id, { method: "DELETE" })
        .then(() => setTodos(todos.filter((item) => item._id !== id)));
    }
  };

  return (
    <div className="container mt-4">
      <div className="bg-primary text-white p-3 rounded text-center">
        <h1>Todo App - MERN Stack</h1>
      </div>
      <div className="mt-4">
        <h3>Add Todo</h3>
        {message && <p className="alert alert-success">{message}</p>}
        {error && <p className="alert alert-danger">{error}</p>}
        <div className="d-flex gap-2">
          <input
            placeholder="Title"
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <input
            placeholder="Description"
            className="form-control"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="mt-4">
        <h3>Tasks</h3>
        <ul className="list-group">
          {todos.map((item) => (
            <li key={item._id} className="list-group-item d-flex justify-content-between align-items-center">
              {editId === item._id ? (
                <div className="d-flex gap-2 flex-grow-1">
                  <input
                    placeholder="Title"
                    className="form-control"
                    onChange={(e) => setEditTitle(e.target.value)}
                    value={edittitle}
                  />
                  <input
                    placeholder="Description"
                    className="form-control"
                    onChange={(e) => setEditDescription(e.target.value)}
                    value={editdescription}
                  />
                </div>
              ) : (
                <div className="flex-grow-1">
                  <strong>{item.title}</strong>
                  <p className="m-0 text-muted">{item.description}</p>
                </div>
              )}
              <div>
                {editId === item._id ? (
                  <>
                    <button className="btn btn-success me-2" onClick={handleUpdate}>Update</button>
                    <button className="btn btn-secondary" onClick={() => setEditId(-1)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}