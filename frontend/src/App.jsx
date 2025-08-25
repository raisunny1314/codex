import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import AdminCreate from "./pages/AdminCreate";
import ProblemPage from "./pages/ProblemPage";
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete";
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";

function App() {

  // code likhna h authenticated k liyeeee....

  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  console.log(user);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Homepage></Homepage> : <Navigate to="/signup" />}></Route>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup></Signup>}></Route >
        <Route

          path="/admin"
          element={
            (isAuthenticated && user?.role === "admin")
              ? <Admin />
              : <Navigate to="/" />
          }
        ></Route>
        <Route path="/admin/create" element={isAuthenticated && user?.role === "admin" ? <AdminCreate /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === "admin" ? <AdminDelete ></AdminDelete> : <Navigate to="/" />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === "admin" ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === "admin" ? <AdminUpload /> : <Navigate to="/" />} />
       {/* Admin Upload Route */}



        {/* <Route path="/admin" element={<AdminPanel/>}></Route> */}

        <Route path="/problem/:problemId" element={<ProblemPage></ProblemPage>}></Route>


      </Routes >
    </>
  )

}
export default App;