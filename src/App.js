import { Routes, Route } from "react-router-dom";
import ErrorPage from "./layouts/error";
import { RequireAuth } from "./hooks/auth/useAuth";
import AdminHome from "./layouts/users/admin/home";
import LoginScreen from "./layouts/login";
import NavBar from "./navBar";
import CourseUser from "./layouts/course/course";
import GradeUser from "./layouts/users/user/views/grade/grade";
import UserHome from "./layouts/users/user/home";
import Test from "./test";

function App() {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route
        path="*"
        element={
          <ErrorPage />
        }
      />
      <Route
        path="/"
        element={
          <LoginScreen />
        }
      />
      <Route
        path="/login"
        element={
          <LoginScreen />
        }
      />
      <Route element={<RequireAuth props={{ clearance: 1 }} />}>
        <Route
          path="/course/:id"
          element={
            <>
              <NavBar />
              <CourseUser />
            </>

          }
        />
        <Route
          path="/home"
          element={
            <>
              <NavBar />
              <UserHome />
            </>
          }
        />
      </Route>
      <Route element={<RequireAuth props={{ clearance: 2 }} />}>

        <Route
          path="/admin"
          element={
            <>
              <NavBar />
              <AdminHome />
            </>

          }
        />
      </Route>
    </Routes>
  );
}

export default App;
