import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useAuth = () => {
	const { isLogin, getUserData, getAuth, userData, logout } = useAuthStore();
	const navigate = useNavigate();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				axios.defaults.withCredentials = true;
				const loginStatus = await getAuth();
				if (loginStatus) {
					await getUserData();
				} else if (!loginStatus) {
					navigate('/login');
					await logout();
					console.log('remove local storage');
				}
			} catch (err) {
				console.log('useAuth hook error: ', err.message);
			}
		};

		checkAuth();
	}, [getAuth, getUserData, navigate, logout]);

	return { userData, isLogin };
};
