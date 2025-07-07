import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import SignUpForm from './pages/Login';
import AuthenticatedRoute from './AuthRoute';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import AdminDashBoard from './pages/Admin/AdminDashBoard';
import AccountSettings from './pages/AccountSettings';
import SimpleSidebar from './components/SideBar';
import AdminLectures from './pages/Admin/AdminLectures';
import UsersLecture from './pages/User/UserLecture';
import AdminTests from './pages/Admin/AdminTests';
import UserDashboard from './pages/User/UserDashboard';
import UserTests from './pages/User/UserTests';
import ViewPdf from './pages/PdfViewer';

const App = () => {
	const getAuth = useAuthStore((state) => state.getAuth);
	const { userData } = useAuthStore();

	useEffect(() => {
		getAuth();
	}, []);

	return (
		<div className="text-white px-5">
			<Routes>
				{/* Public routes */}
				<Route path="/" element={<SignUpForm />} />
				<Route path="/sidebar" element={<SimpleSidebar />} />

				{/* Protected routes */}
				<Route element={<AuthenticatedRoute />}>
					<Route path="/view-pdf/:pdfId" element={<ViewPdf />} />
					<Route path="/dashboard" element={<Home />} />
					<Route path="/email-verify" element={<EmailVerify />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route path="/account-settings" element={<AccountSettings />} />

					{/* ADMIN */}
					{userData?.isAdmin && (
						<>
							<Route path="/admin-dashboard" element={<AdminDashBoard />} />
							<Route path="/admin-lectures" element={<AdminLectures />} />
							<Route path="/admin-tests" element={<AdminTests />} />
						</>
					)}

					{/* USER */}
					{!userData?.isAdmin && (
						<>
							<Route path="/dashboard" element={<Home />} />
							<Route path="/user-tests" element={<UserTests />} />
							<Route path="/user-lectures" element={<UsersLecture />} />
						</>
					)}
					{/* USERS */}
				</Route>
			</Routes>
		</div>
	);
};

export default App;
