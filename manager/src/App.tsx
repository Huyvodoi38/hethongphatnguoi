import Header from "./components/Header";
import AppRoutes from "./routers/routers";
import Sidebar from "./components/Sidebar";
import { useState } from 'react';
import { useAuth } from "./AuthContext/AuthContext";
import Login from "./pages/Login";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) return null; // hoặc render spinner nếu muốn
  if (!currentUser) return <Login />;

  return (
    <div className="flex flex-col h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        <main  className={`flex-1 p-4 transition-all duration-500 pt-20 min-w-[1024px] overflow-auto ${
            isSidebarOpen ? "ml-60" : "ml-0"
          }`}>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;
