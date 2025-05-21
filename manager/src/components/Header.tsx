import { FaBars, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }: {toggleSidebar : () => void}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  return (
    <header className="bg-yellow-500 h-16 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-white text-xl relative hover:bg-gray-300 active:bg-gray-700 hover:bg-opacity-50 p-1 rounded-full cursor-pointer transition-all duration-300"><FaBars /></button>
        <h1 className="text-white text-xl font-bold">Quản lý hệ thống</h1>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-white text-2xl" />
        <span className="text-white">Người quản lý</span>
        <button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600 active:scale-95 cursor-pointer font-semibold px-3 py-1 rounded transition-all">Đăng xuất</button>
      </div>
    </header>
  );
};

export default Header;
