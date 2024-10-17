import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

import PrivateRoute from "./utils/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import ListComplaintsPage from "./pages/ListComplaintsPage";
import CreateUserPage from "./pages/CreateUserPage";
import ListAllUser from "./pages/ListAllUser";
import ListNoticePage from "./pages/ListNoticePage";
import AllAttendancePage from "./pages/AllAttendancePage";
import CreatePermission from "./pages/CreatePermission";
import ListAllRolesPage from "./pages/ListAllRolesPage";
import CreateNoticePage from "./pages/CreateNoticePage";
import ListAllAssignmentPage from "./pages/ListAllAssignmentPage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/user/create"
          element={
            <PrivateRoute>
              <CreateUserPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list/complaints"
          element={
            <PrivateRoute>
              <ListComplaintsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/list"
          element={
            <PrivateRoute>
              <ListAllUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-notice"
          element={
            <PrivateRoute>
              <ListNoticePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-attendance"
          element={
            <PrivateRoute>
              <AllAttendancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create/role"
          element={
            <PrivateRoute>
              <CreatePermission />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-roles"
          element={
            <PrivateRoute>
              <ListAllRolesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-notice"
          element={
            <PrivateRoute>
              <CreateNoticePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/list-assignment"
          element={
            <PrivateRoute>
              <ListAllAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-assignment"
          element={
            <PrivateRoute>
              <CreateAssignmentPage/>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
