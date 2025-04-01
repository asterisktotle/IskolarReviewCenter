import axios from 'axios';
import { create } from 'zustand';

axios.defaults.withCredentials = true;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface UserData {
	_id: string;
	name: string;
	email: string;
	isAccountVerified: boolean;
}

interface PdfFiles {
	_id: string;
	fileId: string;
	subject: string;
	category: string;
	title: string;
	pdf: string;
	uploadDate: string;
}

interface AdminStore {
	totalUser: number | null;
	usersList: UserData[];
	pdfList: PdfFiles[];
	setPdfList: (pdfList: { pdfList: [] }) => void;
	getUsersList: () => Promise<void>;
	getAllPdf: () => Promise<void>;
	messageError: string | null;
	setMessageError: (messageError: string) => void;

	//Upload PDF

	title: string;
	file: null;
	category: string;
	subject: string;
	loading: boolean;
	setLoading: (loading: boolean) => void;
	resetForm: () => void;

	//action to Uploading PDF
	setTitle: (title: string) => void;
	setFile: (file: string) => void;
	setCategory: (category: string) => void;
	setSubject: (subject: string) => void;
	uploadPdfFile: () => Promise<void>;
}

const AdminStore = create<AdminStore>((set, get) => ({
	// all list of data
	totalUser: null,
	usersList: [],
	pdfList: [],

	//message error
	messageError: null,
	setMessageError: (messageError) => set({ messageError }),

	//Dashboard content
	getUsersList: async () => {
		try {
			const { data } = await axios.get(BACKEND_URL + '/api/user/users-list');

			if (!data.success) {
				console.log('getUsersList Success: ', data.success);
				return;
			}

			set((state) => ({
				usersList: data.data,
				totalUser: data.count - 1,
			}));
			console.log('getUsersList executed');
		} catch (err) {
			console.log('getUserEmail error: ', err.message);
		}
	},
	setPdfList: (pdfList) => set({ pdfList }),
	getAllPdf: async () => {
		const { setPdfList, setMessageError } = get();
		try {
			const { data } = await axios.get(BACKEND_URL + '/api/pdf/pdf-lectures');
			const pdf = data.data;
			setPdfList(pdf);
		} catch (err) {
			setMessageError(err.message);
			console.error('getPdf error: ', err);
		}
	},

	//Form state
	title: '',
	file: null,
	category: 'lecture',
	subject: 'mesl',
	loading: false,

	//actions to update form state
	setTitle: (title) => set({ title }),
	setFile: (file) => set({ file }),
	setCategory: (category) => set({ category }),
	setSubject: (subject) => set({ subject }),
	setLoading: (loading) => set({ loading }),

	// Reset form
	resetForm: () =>
		set({
			title: '',
			file: null,
			loading: false,
		}),

	// Prepare form data before submission
	uploadPdfFile: async () => {
		const { title, file, subject, category, resetForm } = get();

		set({ loading: true });

		const formData = new FormData();
		formData.append('title', title);
		formData.append('file', file);
		formData.append('subject', subject);
		formData.append('category', category);

		// Uploading PDF
		try {
			const result = await axios.post(
				BACKEND_URL + '/api/pdf/pdf-lectures',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			resetForm();
			set({ loading: false });
			return result;
		} catch (err) {
			set({ loading: false });
			console.error('Upload error: ', err);
			throw err;
		}
	},

	// Upload Function
}));

export default AdminStore;
