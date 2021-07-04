import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import "./App.css";

function App() {
  const [diaries, setDiaries] = useState([]);
  const [indexValue, setIndexValue] = useState(0);
  const [loading, setLoading] = useState(true);

  //for the new entries page
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [entries, setEntries] = useState("");

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setDiaries(tasksFromServer);
      setLoading(false);
    };
    getTasks();
  }, []);

  //Fetch data
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/diaries");
    const data = await res.json();
    return data;
  };
  // Delete data
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/diaries/${id}`, { method: "DELETE" });
    setDiaries(diaries.filter((diary) => diary.id !== id));
  };

  //Add data
  const addTask = async (diary) => {
    const res = await fetch("http://localhost:5000/diaries", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(diary),
    });
    const data = res.json();
    setDiaries([...diaries, data]);
  };

  //Edit data
  const editTask = async (diary) => {
    let targetId = indexValue + 1;
    const res = await fetch(`http://localhost:5000/diaries/${targetId}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(diary),
    });
    const data = res.json();
    setDiaries([...diaries, data]);
  };

  const onSubmit = (e) => {
    // e.preventDefault();
    if (!title || !date || !entries) {
      e.preventDefault();
      return;
    }
    addTask({ title, date, entries });

    setTitle("");
    setDate("");
    setEntries("");
  };

  const editSubmit = (e) => {
    if (!title && !date && !entries) {
      e.preventDefault();
      return;
    }
    editTask({ title, date, entries });
  };

  if (loading) {
    return <p className="loading-text">Data is loading...</p>;
  }

  return (
    <Router>
      <Switch>
        <Route exact path={["/", "/home"]}>
          <Link to="/new_diary">
            <button className="Button">Added new entries</button>
          </Link>
          <div className="diary-container">
            {diaries.map((diary, index) => {
              return (
                <div>
                  <div className="titleAndbutton">
                    <h2>{diary.title}</h2>
                    <div>
                      <button onClick={() => deleteTask(diary.id)}>
                        Delete
                      </button>
                      <button>|</button>
                      <Link to="edit_diary">
                        <button onClick={() => setIndexValue(diary.id - 1)}>
                          Edit
                        </button>
                      </Link>
                    </div>
                  </div>
                  <h3 className="diary-date">{diary.date}</h3>
                  <p className="diary-entry">{diary.entries}</p>
                  <div className="divider"></div>
                </div>
              );
            })}
          </div>
        </Route>

        <Route path="/new_diary">
          <Link to="/">
            <button className="Button">Back to home</button>
          </Link>
          <div className="form-container">
            <form onSubmit={onSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  placeholder="Add title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Entries:</label>
                <textarea
                  type="text"
                  placeholder="How are you feeling...?"
                  value={entries}
                  onChange={(e) => setEntries(e.target.value)}
                ></textarea>
              </div>
              <div>
                <input type="submit" value="Save" className="save-btn"></input>
              </div>
            </form>
          </div>
        </Route>

        <Route path="/edit_diary">
          <Link to="/">
            <button className="Button">Back to home</button>
          </Link>
          <div className="form-container">
            <h1>Page to Edit Diary</h1>
            <form onSubmit={editSubmit}>
              <div>
                <label>Title:</label>
                <input
                  type="text"
                  placeholder={diaries[indexValue].title}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  placeholder={diaries[indexValue].date}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                ></input>
              </div>
              <div>
                <label>Entries:</label>
                <textarea
                  type="text"
                  placeholder={diaries[indexValue].entries}
                  value={entries}
                  onChange={(e) => setEntries(e.target.value)}
                ></textarea>
              </div>
              <div>
                <input type="submit" value="Save" className="save-btn"></input>
              </div>
            </form>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
