import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8">
            <span className="font-semibold text-gray-700">
                Welcome, {user?.username} <span className="text-xs bg-gray-200 px-2 py-1 rounded">Staff</span>
            </span>
            <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
        </nav>
    );
};  