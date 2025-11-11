import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "animate.css";
import "../styles.css";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [inputMode, setInputMode] = useState("add");
  const [showHamburger, setShowHamburger] = useState(false);
  const hamburgerRef = useRef(null);
  const API = "https://todo-app-with-backend-q88y.vercel.app/api/todos";

  // Fetch todos on mount
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.log(err));
  }, []);

  // Close hamburger when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target)) {
        setShowHamburger(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alert = (title, icon = "success") => {
    Swal.fire({
      icon,
      title,
      timer: 1200,
      showConfirmButton: false,
      background: "#ffffff",
    });
  };

  // Add todo
  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return alert("Please add a todo!", "warning");

    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, completed: false }),
    })
      .then(res => res.json())
      .then(data => {
        setTodos([...todos, data]);
        setInputValue("");
        alert("Added Successfully ✅");
      });
  };

  // Toggle complete
  const toggleComplete = (id, completed) => {
    fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    })
      .then(res => res.json())
      .then(updated => {
        setTodos(todos.map(t => (t._id === id ? updated : t)));
        alert(completed ? "Marked as Done 🎉" : "Restored ✅");
      });
  };

  // Delete todo
  const deleteTodo = (id) => {
    fetch(`${API}/${id}`, { method: "DELETE" })
      .then(() => {
        setTodos(todos.filter(t => t._id !== id));
        alert("Deleted Successfully 🗑");
      });
  };

  // Start edit
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditText(todo.text);
  };

  // Update todo
  const updateTodo = (id) => {
    const trimmedText = editText.trim();
    if (!trimmedText) return alert("Todo cannot be empty!", "warning");

    fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmedText }),
    })
      .then(res => res.json())
      .then(updated => {
        setTodos(todos.map(t => (t._id === id ? updated : t)));
        setEditingId(null);
        setEditText("");
        alert("Updated Successfully ✨");
      });
  };

  const totalCount = todos.length;
  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  // Delete all todos
  const deleteAllTodos = () => {
    Swal.fire({
      title: "Delete all todos?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete all",
    }).then(result => {
      if (result.isConfirmed) {
        todos.forEach(t => fetch(`${API}/${t._id}`, { method: "DELETE" }));
        setTodos([]);
        alert("All todos deleted 🗑");
      }
    });
  };

  // Show completed todos popup
  const showCompletedPopup = () => {
    Swal.fire({
      title: "Completed Todos",
      html: `<div id="completed-todos-popup" style="text-align:left; max-height:300px; overflow:auto;"></div>`,
      showConfirmButton: false,
      showCloseButton: true,
      didOpen: () => {
        const container = document.getElementById("completed-todos-popup");

        completedTodos.forEach(todo => {
          const div = document.createElement("div");
          div.className = "d-flex justify-content-between align-items-center mb-2";
          div.innerHTML = `
            <span style="flex:1; margin-right:8px;">${todo.text}</span>
            <button class="btn btn-sm btn-outline-warning me-1"><i class="bi bi-arrow-counterclockwise"></i></button>
            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
          `;
          // Restore button
          div.children[1].onclick = () => toggleComplete(todo._id, false);
          // Delete button
          div.children[2].onclick = () => deleteTodo(todo._id);
          container.appendChild(div);
        });

        if (completedTodos.length > 0) {
          // Restore All / Delete All Completed buttons
          const restoreAllBtn = document.createElement("button");
          restoreAllBtn.className = "btn btn-sm btn-success me-2 mt-2";
          restoreAllBtn.innerText = "Restore All";
          restoreAllBtn.onclick = () => completedTodos.forEach(todo => toggleComplete(todo._id, false));

          const deleteAllBtn = document.createElement("button");
          deleteAllBtn.className = "btn btn-sm btn-danger mt-2";
          deleteAllBtn.innerText = "Delete All";
          deleteAllBtn.onclick = () => completedTodos.forEach(todo => deleteTodo(todo._id));

          container.appendChild(restoreAllBtn);
          container.appendChild(deleteAllBtn);
        }
      }
    });
  };

  const filteredTodos = inputMode === "search"
    ? pendingTodos.filter(t => t.text.toLowerCase().includes(inputValue.toLowerCase()))
    : pendingTodos;

  return (
    <div className="w-100 d-flex justify-content-center px-2">
      <div className="p-4 bg-white shadow-sm border rounded-4" style={{ width: "100%", maxWidth: "480px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
<h4 className="fw-bold mb-0 d-flex align-items-center gap-2 shimmer-heading text-primary">
  <i className="bi bi-clipboard2-check shimmer-icon"></i> Todo Manager
</h4>


          <div className="position-relative" ref={hamburgerRef}>
            <button className="btn btn-outline-secondary" onClick={() => setShowHamburger(!showHamburger)}>
              <i className="bi bi-list"></i>
              {pendingTodos.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shimmer-badge">
                  {pendingTodos.length}
                </span>
              )}
            </button>

            {showHamburger && (
              <div className="position-absolute end-0 mt-2 p-3 bg-white border rounded shadow-sm animate__animated animate__fadeIn" style={{ width: "180px", zIndex: 10 }}>
                <div className="mb-2 text-center"><small className="text-muted">Total</small><div className="fw-semibold">{totalCount}</div></div>
                <div className="mb-2 text-center"><small className="text-muted">Pending</small><div className="fw-semibold">{pendingTodos.length}</div></div>
                <div className="mb-2 text-center text-success" style={{ cursor: "pointer" }} onClick={showCompletedPopup}>
                  <small className="text-muted">Completed</small>
                  <div className="fw-semibold">{completedTodos.length}</div>
                </div>
                {todos.length > 0 && (
                  <button className="btn btn-sm btn-danger w-100 mt-2" onClick={deleteAllTodos}>
                    Delete All Todos
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="input-group mb-3">
          <input
            className="form-control"
            placeholder={inputMode === "add" ? "Add new todo..." : "Search..."}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && inputMode === "add") addTodo(); }}
          />
          <button className="btn btn-primary" onClick={() => { if (inputMode === "add") addTodo(); }}>
            <i className={`bi ${inputMode === "add" ? "bi-plus-lg" : "bi-search"}`}></i>
          </button>
          <button className="btn btn-outline-secondary" onClick={() => { setInputMode(inputMode === "add" ? "search" : "add"); setInputValue(""); }}>
            {inputMode === "add" ? <i className="bi bi-search"></i> : <i className="bi bi-plus-lg"></i>}
          </button>
        </div>

        {/* Pending Todos List */}
        <ul className="list-group overflow-auto" style={{ maxHeight: "200px" }}>
          {filteredTodos.map(t => (
            <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center border rounded-3 mb-2 text-wrap">
              {editingId === t._id ? (
                <input className="form-control me-2" value={editText} onChange={(e) => setEditText(e.target.value)} />
              ) : (
                <span style={{ maxWidth: "65%", wordBreak: "break-word" }}>{t.text}</span>
              )}
              <div className="d-flex gap-1">
                {editingId === t._id ? (
                  <button className="btn btn-sm btn-success rounded-circle" onClick={() => updateTodo(t._id)}>
                    <i className="bi bi-check-lg"></i>
                  </button>
                ) : (
                  <>
                    <button className="btn btn-sm btn-outline-success rounded-circle" onClick={() => toggleComplete(t._id, true)}>
                      <i className="bi bi-check2-circle"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => startEdit(t)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => deleteTodo(t._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
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

export default TodoList;
