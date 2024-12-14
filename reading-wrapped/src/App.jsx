import Main from "./components/Main";
import readingData from "./data/reading_stats_2024.json";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Main data={readingData} />
    </div>
  );
}

export default App;
