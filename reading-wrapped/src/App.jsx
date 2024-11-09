import ReadingStats from "./components/ReadingStats";
import readingData from "./data/reading_stats_2024.json";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <ReadingStats data={readingData} />
    </div>
  );
}

export default App;
