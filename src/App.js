import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { About } from "./components/About";
import { AddCourse } from "./components/AddCourse";
import AddModule from "./components/AddModule";
import { AdminCoursePanel } from "./components/AdminCoursesPanel";
import AdminPanel from "./components/AdminPanel";
import { Contact } from "./components/Contact";
import { CourseModule } from "./components/CourseModule";
import CourseModuleDetail from "./components/CourseModuleDetail";
import { Courses } from "./components/Courses";
import { CredentialVerify } from "./components/CredentialVerify";
import { ExamResult } from "./components/ExamResult";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/homepage";
import { LeaderBoard } from "./components/LeaderBoard";
import { LoginSignup } from "./components/login-signup";
import ModuleList from "./components/ModuleList";
import { Navbar } from "./components/Navbar";
import { Profile } from "./components/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/register";
import { ShowCertificates } from "./components/ShowCertificates";
import { TakeExam } from "./components/TakeExam";
import { Invoice } from "./components/test";
import { UpdateProfile } from "./components/UpdateProfile";
import { UserAttempts } from "./components/UserAttempts";
import { VerifyOtp } from "./components/verifyotp";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/course/modules" element={<ModuleList />} />
          {/* <Route path="/course/:courseId/module/:moduleNumber" element={<ModuleDetail />} /> */}
          <Route path="/course/add-module" element={<AddModule />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/course/:courseId/module/:moduleNumber"
            element={<CourseModuleDetail />}
          />
          <Route path="/course/:courseId/modules" element={<CourseModule />} />
          <Route path="/course/:courseId/exam" element={<TakeExam />} />
          <Route path="/result/:attemptId" element={<ExamResult />} />
          <Route path="/attempts" element={<UserAttempts />} />
          <Route path="/certificates" element={<ShowCertificates />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/credential-verify" element={<CredentialVerify />} />
          <Route path="/admincourses" element={<AdminCoursePanel />} />
          {/* Protect Routes */}
          {/* <Route path="/addcourse" element={<ProtectedRoute> <AddCourse /> </ProtectedRoute>}/> */}
          <Route
            path="/updateprofile"
            element={
              <ProtectedRoute>
                {" "}
                <UpdateProfile />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                {" "}
                <Profile />{" "}
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
