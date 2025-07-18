import './App.css';
import Header from './MyComponents/Header';
import Footer from './MyComponents/Footer';
import Todos from './MyComponents/Todos';
import AddTodos from './MyComponents/AddTodos';
import About from './MyComponents/About';
import { getDoc, updateDoc } from "firebase/firestore";
import dayjs from "dayjs"; // install using `npm install dayjs`
import Auth from './MyComponents/Auth';
import AuthSignUp from './MyComponents/AuthSignUp';
import Profile from './MyComponents/Profile';
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import { useContext } from "react";
import { AuthContext } from './AuthContext';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";


function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);

  const { profile } = useContext(AuthContext);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [lowerTime, setLowerTime] = useState("");
  const [upperTime, setUpperTime] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const priorityValue = { High: 1, Med: 2, Low: 3 };

  const total = todos.length;
  const completed = todos.filter(t => t.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);


  // Apply theme
  useEffect(() => {
    document.body.className =
      theme === "dark" ? "bg-dark text-light" : "bg-light text-dark";
  }, [theme]);

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch todos from Firestore
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "todos"),
      orderBy("sno", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTodos = snapshot.docs.map((doc) => doc.data());
      setTodos(newTodos);
    });

    return unsubscribe;
  }, [user]);

  const addTodo = async (title, desc, time, priority = "High") => {
    const sno = todos.length === 0 ? 1 : todos[todos.length - 1].sno + 1;
    const myTodo = { sno, title, desc, time, priority, done: false };

    setTodos((prev) => [...prev, myTodo]);

    // Use setDoc with sno as ID
    await setDoc(
      doc(db, "users", user.uid, "todos", sno.toString()),
      myTodo
    );
  };

  const onDelete = async (todo) => {
    setTodos(todos.filter((e) => e.sno !== todo.sno));
    await deleteDoc(doc(db, "users", user.uid, "todos", todo.sno.toString()));
  };

  const editTodo = async (updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.sno === updatedTodo.sno ? updatedTodo : todo))
    );
    await setDoc(
      doc(db, "users", user.uid, "todos", updatedTodo.sno.toString()),
      updatedTodo
    );
  };




  const toggleDone = async (todoToToggle) => {
    const updatedTodos = todos.map((todo) =>
      todo.sno === todoToToggle.sno ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updatedTodos);

    const updated = updatedTodos.find((t) => t.sno === todoToToggle.sno);
    await setDoc(doc(db, "users", user.uid, "todos", updated.sno.toString()), updated);

    // 🔥 Streak logic
    if (updated.done) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const today = dayjs().format("YYYY-MM-DD");

      if (userSnap.exists()) {
        const data = userSnap.data();
        const lastDate = data.lastCompletedDate || "";
        let newStreak = data.streak || 0;

        if (lastDate === dayjs().subtract(1, "day").format("YYYY-MM-DD")) {
          newStreak += 1; // increment streak
        } else if (lastDate !== today) {
          newStreak = 1; // reset streak
        }

        await updateDoc(userRef, {
          streak: newStreak,
          lastCompletedDate: today
        });
      }
    }
  };
  const getFilteredTodos = () => {
    return todos
      .filter((todo) => {
        if (
          statusFilter !== "all" &&
          ((statusFilter === "active" && todo.done) ||
            (statusFilter === "completed" && !todo.done))
        )
          return false;
        if (priorityFilter !== "all" && todo.priority !== priorityFilter)
          return false;
        if (lowerTime && todo.time < lowerTime) return false;
        if (upperTime && todo.time > upperTime) return false;

        if (searchTrigger && searchKeyword.trim() !== "") {
          const keyword = searchKeyword.toLowerCase();
          const matches =
            todo.title?.toLowerCase().includes(keyword) ||
            todo.desc?.toLowerCase().includes(keyword) ||
            todo.time?.toLowerCase().includes(keyword) ||
            todo.priority?.toLowerCase().includes(keyword);
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.done !== b.done) return a.done ? 1 : -1;
        if (a.time !== b.time) return a.time.localeCompare(b.time);
        const aPriority = priorityValue[a.priority] || 4;
        const bPriority = priorityValue[b.priority] || 4;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.sno - b.sno;
      });
  };

  return (
    <Router>
      <Header title="My Todo List" theme={theme} setTheme={setTheme} user={user} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <div className="container my-3">
                <AddTodos addTodo={addTodo} />

                {/* Filters */}
                Today's Progress:-
                <div className="progress my-3  ">
                  <div className="progress-bar " role="progressbar" style={{ width: `${percentage}%` }}>
                    {percentage}%
                  </div>
                </div>

                <div className="container-fluid my-3">
                  🔥 Current Streak:
                  <strong>
                    {profile?.streak || 0} {profile?.streak === 1 ? "day" : "days"}
                  </strong>
                  <div className="container text-end">
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Hide Filters" : "Search & Filter"}
                  </button>
                </div>
                </div>

                

                {showFilters && (
                  <div className="container mb-4 p-3 border rounded shadow-sm bg-light">
                    <h5 className="mb-3">🔍 Filter & Search Tasks</h5>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-3">
                        <label className="form-label fw-bold">Status</label>
                        <select
                          className="form-select"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-bold">Priority</label>
                        <select
                          className="form-select"
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                          <option value="all">All</option>
                          <option value="High">High</option>
                          <option value="Med">Med</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label fw-bold">From Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={lowerTime}
                          onChange={(e) => setLowerTime(e.target.value)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label fw-bold">To Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={upperTime}
                          onChange={(e) => setUpperTime(e.target.value)}
                        />
                      </div>

                      <div className="col-md-10 mt-2">
                        <label className="form-label fw-bold">Search</label>
                        <input
                          type="text"
                          className="form-control"
                          value={searchKeyword}
                          placeholder="e.g. gym, shopping..."
                          onChange={(e) => setSearchKeyword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && setSearchTrigger(true)}
                        />
                      </div>
                      <div className="col-md-2 mt-2 d-grid">
                        <button
                          className="btn btn-primary"
                          onClick={() => setSearchTrigger(true)}
                        >
                          Search
                        </button>
                      </div>

                      {searchTrigger && (
                        <div className="col-12 mt-2 text-end">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setSearchKeyword("");
                              setSearchTrigger(false);
                            }}
                          >
                            Clear Search
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Todos
                  todos={getFilteredTodos()}
                  clearAllTodos={() => {
                    todos.forEach(async (todo) => {
                      await deleteDoc(doc(db, "users", user.uid, "todos", todo.sno.toString()));
                    });
                    setTodos([]);
                  }}
                  onDelete={onDelete}
                  onEdit={editTodo}
                  onToggleDone={toggleDone}
                />
              </div>
            ) : (
              <Auth setUser={setUser} />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/login" element={<Auth setUser={setUser} />} />
        <Route path="/signup" element={<AuthSignUp setUser={setUser} />} />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
