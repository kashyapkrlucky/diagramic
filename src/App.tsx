import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import SignIn from "./pages/SignIn";

const EditorRoute = React.lazy(() => import("./pages/Editor"));
const HomeRoute = React.lazy(() => import("./pages/Home"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/editor/:id" element={<EditorRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
