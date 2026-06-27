import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // ================= FETCH TASKS =================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (error) {
      console.log("Fetch Tasks Error:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= ADD TASK =================
  const addTask = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      return alert("Fill all fields");
    }

    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        title: "",
        description: "",
      });

      fetchTasks();
    } catch (error) {
      console.log("Add Task Error:", error.message);
    }
  };

  // ================= DELETE TASK =================
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();
    } catch (error) {
      console.log("Delete Error:", error.message);
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log("Update Error:", error.message);
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="dashboard">

      <div className="top-bar">
        <div>
          <h1>TaskFlow Dashboard</h1>
          <p>Manage your tasks smartly</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="stats">
        <div className="stat-card">
          <h2>{tasks.length}</h2>
          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h2>{completedTasks}</h2>
          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h2>{tasks.length - completedTasks}</h2>
          <p>Pending</p>
        </div>
      </div>

      {/* ADD TASK FORM */}
      <form onSubmit={addTask} className="task-form">

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit">Add Task</button>
      </form>

      {/* TASK LIST */}
      <div className="task-list">
        {tasks.map((task) => (
          <div className="task-card" key={task._id}>

            <div className="task-header">
              <h2>{task.title}</h2>
              <span
                className={
                  task.status === "Completed"
                    ? "status completed"
                    : "status pending"
                }
              >
                {task.status}
              </span>
            </div>

            <p>{task.description}</p>

            <div className="task-actions">
              <button onClick={() => updateStatus(task._id)}>
                Update
              </button>

              <button onClick={() => deleteTask(task._id)}>
                Delete
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;