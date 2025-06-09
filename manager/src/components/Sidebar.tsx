import { FaExclamationTriangle, FaQuestionCircle } from "react-icons/fa";
import SidebarItem from "./SidebarItem";
import { FaCar } from "react-icons/fa";
import { FaFileAlt } from "react-icons/fa";

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div
      className={`bg-blue-600 text-white h-full pt-32 p-4 fixed left-0 w-60 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-all duration-500`}
    >
      <nav>
        <ul className="space-y-3">
          <li>
            <SidebarItem to="/qlvipham" icon={FaExclamationTriangle} label="Quản lý vi phạm" />
          </li>
          <li>
            <SidebarItem to="/qlkhieunai" icon={FaQuestionCircle} label="Quản lý khiếu nại" />
          </li>
          <li>
            <SidebarItem to="/qlphuongtien" icon={FaCar} label="Quản lý phương tiện" />
          </li>
          <li>
            <SidebarItem to="/qlminhchung" icon={FaFileAlt} label="Quản lý minh chứng" />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
