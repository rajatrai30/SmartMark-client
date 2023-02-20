import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import {
  AttendanceProvider,
  AuthProvider,
  CourseProvider,
  EnrolmentProvider,
  FacePhotoProvider,
  FaceThresholdDistanceProvider,
  NavbarProvider,
  NotificationProvider,
} from "./context";
import {
  CourseDetails,
  Dashboard,
  MainMenu,
  NoFound,
  Notifications,
  Profile,
  SignIn,
  SignUp,
  InCourseAttendanceHistory,
  SingleAttendanceHistory,
  AttendanceRoom,
  UndefinedCardIDAndRole,
  PrivacyPolicy,
  TermCondition,
  UserGuidelines,
  About,
  defaultList,
  defaulterDetails,
  defaulterListTable,
  defaulterListTableInner,
  StudentDashBoard,
  CourseDashBoardData
} from "./pages/common";
import {
  AttendanceForm,
} from "./pages/lecturerPage";
import { FaceGallery } from "./pages/studentPage";
import {
  AuthRoute,
  LecturerRoute,
  ProtectedRoute,
  StudentRoute,
  UndefinedCardIDAndRoleRoute,
} from "./routes";
import Testing from "./Testing";
import "lazysizes";
import enrolledCourse from "./pages/common/studentDashBoard/enrolledCourse";
import enrolledCourseSingleHistory from "./pages/common/studentDashBoard/enrolledCourseSingleHistory";

function App() {
  return (
    <NavbarProvider>
      <AuthProvider>
        <NotificationProvider>
          <AttendanceProvider>
            <CourseProvider>
              <EnrolmentProvider>
                <FacePhotoProvider>
                  <FaceThresholdDistanceProvider>
                    <Router>
                      <Switch>
                        <ProtectedRoute exact path="/" component={MainMenu} />
                        <ProtectedRoute
                          exact
                          path="/signin"
                          component={SignIn}
                        />
                        <ProtectedRoute
                          exact
                          path="/signup"
                          component={SignUp}
                        />

                        <UndefinedCardIDAndRoleRoute
                          exact
                          path="/aboutYourself"
                          component={UndefinedCardIDAndRole}
                        />
                        <AuthRoute
                          exact
                          path="/dashboard"
                          component={Dashboard}
                        />
                        <AuthRoute exact path="/profile" component={Profile} />
                        <AuthRoute
                          exact
                          path="/notification"
                          component={Notifications}
                        />
                        <AuthRoute
                          exact
                          path="/course/:id"
                          component={CourseDetails}
                        />
                        <AuthRoute
                          exact
                          path="/defaultlist/:id"
                          component={defaulterDetails}
                        />
                        <AuthRoute
                          exact
                          path="/course/:id/defaultListTable"
                          component={defaulterListTable}
                        />
                        <AuthRoute
                          exact
                          path="/course/:courseID/defaultListTable/:attendanceID"
                          component={defaulterListTableInner}
                        />

                        {/* STUDENT DASHBAORD */}
                        <AuthRoute
                          exact
                          path="/studentdashboard"
                          component={StudentDashBoard}
                        />
                        <AuthRoute
                          exact
                          path="/coursedashboard"
                          component={CourseDashBoardData}
                        />

                        <LecturerRoute
                          exact
                          path="/course/:id/attendanceForm"
                          component={AttendanceForm}
                        />
                        <AuthRoute
                          exact
                          path="/course/:courseID/attendanceRoom/:attendanceID"
                          component={AttendanceRoom}
                        />

                        <AuthRoute
                          exact
                          path="/course/:id/attendanceList"
                          component={InCourseAttendanceHistory}
                        />

                        <AuthRoute
                          exact
                          path="/course/:id/enrolledCourse"
                          component={enrolledCourse}
                        />

                        <AuthRoute
                          exact
                          path="/course/:courseID/attendanceList/:attendanceID"
                          component={SingleAttendanceHistory}
                        />

                        <AuthRoute
                          exact
                          path="/course/:courseID/enrolledCourse/:attendanceID"
                          component={enrolledCourseSingleHistory}
                        />

                        <StudentRoute
                          exact
                          path="/facegallery"
                          component={FaceGallery}
                        />
                        <Route
                          exact
                          path="/termandcondition"
                          component={TermCondition}
                        />
                        <Route
                          exact
                          path="/about"
                          component={About}
                        />
                        <Route
                          exact
                          path="/privacypolicy"
                          component={PrivacyPolicy}
                        />
                        <Route
                          exact
                          path="/userguidelines"
                          component={UserGuidelines}
                        />
                        <Route
                          exact
                          path="/defaulterList"
                          component={defaultList}
                        />
                        <AuthRoute component={NoFound} />
                      </Switch>
                    </Router>
                  </FaceThresholdDistanceProvider>
                </FacePhotoProvider>
              </EnrolmentProvider>
            </CourseProvider>
          </AttendanceProvider>
        </NotificationProvider>
      </AuthProvider>
    </NavbarProvider>
  );
}

export default App;
