// src/App.js

// import Login from "./pages/Login";
// import Register from "./pages/Register";

// function App() {
//   return (
//     <div>
//       {/* Yalnızca birini göstermek için */}
//       {/* <Login /> */}
//       <Register />
//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
    const token = localStorage.getItem("token");

  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<Navigate to="/login" />} />
  //       <Route path="/login" element={<Login />} />
  //       <Route path="/register" element={<Register />} />
  //     </Routes>
  //   </Router>
  // );

    return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
