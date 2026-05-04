import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

const HomeRoute = React.lazy(() => import("./pages/Home"));
const EditorRoute = React.lazy(() => import("./pages/Editor"));
const SignInRoute = React.lazy(() => import("./pages/SignIn"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/sign-in" element={<SignInRoute />} />
        <Route path="/editor/:id" element={<EditorRoute />} />
      </Routes>
    </Router>
  );
}

export default App;
