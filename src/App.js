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

  if (loading) {
    return <p>Data is loading...</p>;
  }

  const onSubmit = (e) => {
    // e.preventDefault();
    if (!title) {
      alert("Please add a diary");
      return;
    }
    addTask({ title, date, entries });

    setTitle("");
    setDate("");
    setEntries("");
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <h1>All Diary Entry</h1>
          <Link to="/new_diary">
            <button>Added new entries</button>
          </Link>
          <div>
            {diaries.map((diary, index) => {
              return (
                <div>
                  <h2>{diary.title}</h2>
                  <h3>{diary.date}</h3>
                  <p>{diary.entries}</p>
                  <button onClick={() => deleteTask(diary.id)}>Delete</button>
                </div>
              );
            })}
          </div>
        </Route>

        <Route path="/new_diary">
          <h1>New Entry Pages</h1>
          <Link to="/">
            <button>Back to home</button>
          </Link>

          <form onSubmit={onSubmit}>
            <label>Title</label>
            <input
              type="text"
              placeholder="add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>

            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            ></input>

            <label>Entries</label>
            <textarea
              type="text"
              placeholder="Entries"
              value={entries}
              onChange={(e) => setEntries(e.target.value)}
            ></textarea>

            <input type="submit" value="Save"></input>
          </form>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
