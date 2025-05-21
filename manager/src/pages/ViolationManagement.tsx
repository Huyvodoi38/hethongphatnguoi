import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";

const ViolationManagement = () => {
  const [violations, setViolations] = useState<any[]>([]);
  const headers = ["ID", "Biển số", "Loại vi phạm", "ID người tạo", "Hành động"];
  const columns = ["id", "plate", "category", "creator_id"];

  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [inputId, setInputId] = useState("");
  const [inputPlate, setInputPlate] = useState("");

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const params: any = {};
        if (searchId) params.violation_id = searchId;
        if (searchPlate) params.vehicle_plate = searchPlate;
        const res = await api.get(`/violations/`, { params });
        setViolations(res.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm vi phạm:", error);
      }
    };
    fetchViolations();
  }, [searchId, searchPlate]);

  const handleSearch = () => {
    setSearchId(inputId);
    setSearchPlate(inputPlate);
  };

  const handleDetail = (id: number) => {
    console.log("Chi tiết vi phạm", id);
    navigate(`/qlvipham/detail/${id}`);
  };

  const handleAdd = () => {
    console.log("Thêm vi phạm");
    navigate("/qlvipham/add");
  };

  const handleEdit = (id: number) => {
    console.log("Sửa vi phạm", id);
    navigate(`/qlvipham/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vi phạm này?")) return;
    try {
      await api.delete(`/violations/${id}`);
      setViolations((prev) => prev.filter((v) => v.id !== id));
      alert("Đã xóa thành công");
    } catch (error) {
      console.error("Lỗi khi xóa vi phạm:", error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý vi phạm</h1>
      <AddButton onClick={handleAdd} label="Thêm vi phạm" icon={FaUserPlus} />
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="Tìm theo ID..."
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="p-2 border rounded w-1/3"
        />
        <input
          type="text"
          placeholder="Tìm theo biển số..."
          value={inputPlate}
          onChange={(e) => setInputPlate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="p-2 border rounded w-1/3"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tìm kiếm
        </button>
      </div>
      <div className="p-4">
        <ManagementTable
          headers={headers}
          columns={columns}
          data={violations.map((violation: any) => ({
            id: violation.id,
            plate: violation.vehicle?.plate,
            category: violation.category,
            creator_id: violation.creator?.id,
          }))}
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ViolationManagement;
