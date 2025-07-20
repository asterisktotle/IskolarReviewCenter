import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

const NotFound = () => {
    const navigate = useNavigate();
    const {userData} = useAuthStore()
    return (
        <div className="text-center p-8">
            <h1>Oops! Page not found</h1>
            <p>The page you're looking for might have been moved or deleted.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
            <Link to={userData ? "/dashboard" : "/"}>
                {userData ? "Dashboard" : "Home"}
            </Link>
        </div>
    );
};

export default NotFound;