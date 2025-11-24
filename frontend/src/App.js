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
import Products from "./pages/Products";
import Layout from "./components/Layout";

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

        <Route element={token ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          {/* Placeholder routes for now */}
          <Route path="/customers" element={<div className="p-4">Customers Page (Coming Soon)</div>} />
          <Route path="/settings" element={<div className="p-4">Settings Page (Coming Soon)</div>} />
        </Route>

        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
