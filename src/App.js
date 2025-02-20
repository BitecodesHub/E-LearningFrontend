import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Register } from "./components/register";
import { VerifyOtp } from "./components/verifyotp";
import { HomePage } from "./components/homepage";
import { LoginSignup } from "./components/login-signup";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AddCourse } from "./components/AddCourse";
import { Courses } from "./components/Courses";
import { Invoice } from "./components/test";
import { Profile } from "./components/Profile";
import { UpdateProfile } from "./components/UpdateProfile";
import ModuleList from "./components/ModuleList";
import ModuleDetail from "./components/ModuleDetail";
import AddModule from "./components/AddModule";
import AdminPanel from "./components/AdminPanel";
import { AdminCoursePanel } from "./components/AdminCoursesPanel";
import { Contact } from "./components/Contact";
import { About } from "./components/About";
import { LeaderBoard } from "./components/LeaderBoard";
import { CredentialVerify } from "./components/CredentialVerify";
import { CourseModule } from "./components/CourseModule";
import CourseModuleDetail from "./components/CourseModuleDetail";
import { TakeExam } from "./components/TakeExam";
import { ExamResult } from "./components/ExamResult";
import { UserAttempts } from "./components/UserAttempts";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/" element={< HomePage/>} />
          <Route path="/courses" element={< Courses/>} />
          <Route path="/invoice" element={< Invoice/>} />
          <Route path="/course/modules" element={<ModuleList />} />
          {/* <Route path="/course/:courseId/module/:moduleNumber" element={<ModuleDetail />} /> */}
          <Route path="/course/add-module" element={<AddModule />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/addcourse" element={<AddCourse />}/>
          <Route path="/contact" element={<Contact />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/course/:courseId/module/:moduleNumber" element={<CourseModuleDetail />} />
          <Route path="/course/:courseId/modules" element={<CourseModule />} />
          <Route path="/course/:courseId/exam" element={<TakeExam />} />
          <Route path="/result/:attemptId" element={<ExamResult />} />
          <Route path="/attempts" element={<UserAttempts />} />


          <Route path="/leaderboard" element={<LeaderBoard/>}/>
          <Route path="/credential-verify" element={<CredentialVerify/>}/>
          <Route path="/admincourses" element={<AdminCoursePanel />}
          />

          {/* Protect Routes */}
          {/* <Route path="/addcourse" element={<ProtectedRoute> <AddCourse /> </ProtectedRoute>}/> */}
          <Route path="/updateprofile" element={<ProtectedRoute> < UpdateProfile/> </ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute> < Profile/> </ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
