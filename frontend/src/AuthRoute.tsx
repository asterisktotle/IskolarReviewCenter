import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../src/store/store.js';
const AuthenticatedRoute = () => {
	const isLogin = useAuthStore((state) => state.isLogin);
	if (!isLogin) {
		console.log('auth route mounted');
		return <Navigate replace to={'/login'} />;
	}
	return <Outlet />;
};

export default AuthenticatedRoute;
