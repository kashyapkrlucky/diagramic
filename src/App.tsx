import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

const EditorRoute = React.lazy(() => import("./pages/Editor"));
const SignInRoute = React.lazy(() => import("./pages/SignIn"));
const HomeRoute = React.lazy(() => import("./pages/Home"));

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
