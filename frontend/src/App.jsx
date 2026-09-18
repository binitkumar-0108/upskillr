import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard router
import DashboardRouter from './pages/DashboardRouter';

// Learner
import LearnerDashboard from './pages/learner/LearnerDashboard';
import CourseCatalogPage from './pages/learner/CourseCatalogPage';
import CourseDetailPage from './pages/learner/CourseDetailPage';
import LearningPage from './pages/learner/LearningPage';
import MyCoursesPage from './pages/learner/MyCoursesPage';
import ProfilePage from './pages/learner/ProfilePage';

// Instructor
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import InstructorCoursesPage from './pages/instructor/InstructorCoursesPage';
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import CourseBuilderPage from './pages/instructor/CourseBuilderPage';
import InstructorStudentsPage from './pages/instructor/InstructorStudentsPage';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';

// Super Admin
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard';
import InstitutesPage from './pages/superAdmin/InstitutesPage';
import SuperAdminAdminsPage from './pages/superAdmin/SuperAdminAdminsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1A1917',
              border: '1px solid #E5E3DF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontSize: '13px',
              borderRadius: '6px',
            },
            success: { iconTheme: { primary: '#1A7A4A', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#C0392B', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — all roles */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            {/* Dashboard — role-based redirect */}
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Learner dashboard */}
            <Route path="/dashboard/learner" element={
              <ProtectedRoute roles={['learner']}>
                <LearnerDashboard />
              </ProtectedRoute>
            } />

            {/* Shared course pages — accessible by learner, instructor, admin, superAdmin */}
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/learn/:courseId" element={
              <ProtectedRoute roles={['learner']}>
                <LearningPage />
              </ProtectedRoute>
            } />
            <Route path="/my-courses" element={
              <ProtectedRoute roles={['learner']}>
                <MyCoursesPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Instructor routes */}
            <Route path="/dashboard/instructor" element={
              <ProtectedRoute roles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses" element={
              <ProtectedRoute roles={['instructor']}>
                <InstructorCoursesPage />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/new" element={
              <ProtectedRoute roles={['instructor']}>
                <CreateCoursePage />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/:courseId/build" element={
              <ProtectedRoute roles={['instructor']}>
                <CourseBuilderPage />
              </ProtectedRoute>
            } />
            <Route path="/instructor/students" element={
              <ProtectedRoute roles={['instructor']}>
                <InstructorStudentsPage />
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/dashboard/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <UserManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute roles={['admin']}>
                <AdminCoursesPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/activity" element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Super Admin routes */}
            <Route path="/dashboard/superadmin" element={
              <ProtectedRoute roles={['superAdmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/institutes" element={
              <ProtectedRoute roles={['superAdmin']}>
                <InstitutesPage />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/admins" element={
              <ProtectedRoute roles={['superAdmin']}>
                <SuperAdminAdminsPage />
              </ProtectedRoute>
            } />
            <Route path="/superadmin/courses" element={
              <ProtectedRoute roles={['superAdmin']}>
                <AdminCoursesPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
