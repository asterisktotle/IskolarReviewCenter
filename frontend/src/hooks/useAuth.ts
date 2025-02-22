import { useEffect } from 'react';
import useAuthStore from '../store/store';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useAuth = () => {
	const { isLogin, getUserData, getAuth, userData } = useAuthStore();
	const navigate = useNavigate();
	axios.defaults.withCredentials = true;

	useEffect(() => {
		const checkAuth = async () => {
			try {
				await getAuth();
				if (isLogin) {
					await getUserData();
					navigate('/');
				} else navigate('/login');
			} catch (err) {
				console.log('useAuth hook error: ', err.message);
			}
		};

		checkAuth();
	}, []);

	return { userData };
};
