// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ParentLogin from "./ParentLogin";
import ResultView from "./ResultView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ParentLogin />} />
      <Route path="/result" element={<ResultView />} />
    </Routes>
  );
}

export default App;
