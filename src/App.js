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
import { ExamResult } from "./components/ExamResult";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/homepage";
import { LoginSignup } from "./components/login-signup";
import ModuleList from "./components/ModuleList";
import { Navbar } from "./components/Navbar";
import { Profile } from "./components/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/register";
import { ShowCertificates } from "./components/ShowCertificates";
import { TakeExam } from "./components/TakeExam";
import { UpdateProfile } from "./components/UpdateProfile";
import { UserAttempts } from "./components/UserAttempts";
import { VerifyOtp } from "./components/verifyotp";
import { VerifyCredential } from "./components/VerifyCredential";

import { LeaderBoard } from "./components/LeaderBoard";
import { CertificateQr } from "./components/CertificateQr";
import { SocialMedia } from "./components/SocialMedia";
import LegalTermsPage from "./components/LegalTermsPage";
import AI from "./components/AI";

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
          <Route path="/course/modules" element={<ModuleList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/credential/:credentialId" element={<CertificateQr />} />
          <Route path="/socialmedia" element={<SocialMedia />} />
          <Route path="/terms" element={<LegalTermsPage />} /> 
          <Route
            path="/course/:courseId/module/:moduleNumber"
            element={<CourseModuleDetail />}
          />
          <Route path="/course/:courseId/modules" element={<CourseModule />} />
          <Route path="/leaderboard" element={<LeaderBoard/>} />
          <Route path="/credential-verify" element={<VerifyCredential />} />
          <Route path="/ai" element={<AI />} />
          

          {/* Protect Routes */}
          {/* <Route path="/course/:courseId/exam" element={<TakeExam />} />
          <Route path="/admincourses" element={<AdminCoursePanel />} />
          <Route path="/certificates" element={<ShowCertificates />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/result/:attemptId" element={<ExamResult />} />
          <Route path="/course/add-module" element={<AddModule />} />
          <Route path="/attempts" element={<UserAttempts />} /> */}
          {/* <Route path="/addcourse" element={<ProtectedRoute> <AddCourse /> </ProtectedRoute>}/> */}


          <Route path="/course/:courseId/exam" element={<ProtectedRoute><TakeExam /></ProtectedRoute>} />
        <Route path="/admincourses" element={<ProtectedRoute><AdminCoursePanel /></ProtectedRoute>} />
        <Route path="/certificates" element={<ProtectedRoute><ShowCertificates /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path="/addcourse" element={<ProtectedRoute><AddCourse /></ProtectedRoute>} />
        <Route path="/result/:attemptId" element={<ProtectedRoute><ExamResult /></ProtectedRoute>} />
        <Route path="/course/add-module" element={<ProtectedRoute><AddModule /></ProtectedRoute>} />
        <Route path="/attempts" element={<ProtectedRoute><UserAttempts /></ProtectedRoute>} />

          <Route
          path="/updateprofile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
