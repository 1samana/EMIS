import { Routes, Route, Navigate } from "react-router-dom";
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
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import ListAllAssignmentPage from "./pages/ListAllAssignmentPage";
import CreateAttendacePage from "./pages/CreateAttendancePage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import CreateQuestionPage from "./pages/CreateQuestionPage";
import DisplayQnAPage from "./pages/DisplayQnAPage";
function App() {
  const { userRole, authToken } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={!authToken ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>

      {authToken && (
        <div className="flex">
          <Sidebar />
          <div className="flex-grow bg-gray-100 min-h-screen">
            <Topbar />
            <div className="px-6">
              <div className="container mx-auto my-8">
                {/* display UI for Admin  only */}
                {userRole === "Admin" ? (
                  <Routes>
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
              <CreateAssignmentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-attendance"
          element={
            <PrivateRoute>
              <CreateAttendacePage />
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
          path="/create-qna"
          element={
            <PrivateRoute>
              <CreateQuestionPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/list-qna"
          element={
            <PrivateRoute>
              <DisplayQnAPage />
            </PrivateRoute>
          }
        />
                  </Routes>
                ) : userRole === "Teacher" ? (
                  // display  UI for Teacher
                  <h1>This is the teacher dashboard</h1>
                ) : userRole === "Student" ? (
                  // display UI for Student
                  <h1> This is the student dashboard </h1>
                ) : (
                  <h1>Invalid role</h1>
                )}

                {/* diplay UI for Teacher only */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
