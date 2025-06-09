import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";

const ViolationManagement = () => {
  const [violations, setViolations] = useState<any[]>([]);
  const headers = ["Thời gian", "Biển số", "Loại vi phạm", "ID người tạo", "Hành động"];
  const columns = ["created_at", "plate", "category", "creator_id"];

  const navigate = useNavigate();
  const [searchMinTime, setSearchMinTime] = useState("");
  const [searchMaxTime, setSearchMaxTime] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [inputMinTime, setInputMinTime] = useState("");
  const [inputMaxTime, setInputMaxTime] = useState("");
  const [inputPlate, setInputPlate] = useState("");

  useEffect(() => {
    const fetchViolations = async () => {
      try {
        const params: any = {};
        const formatDateTime = (value: string) => {
          if (!value) return value;
          if (value.length === 16) value += ':00';
          if (!value.endsWith('Z')) value += 'Z';
          return value;
        };
        if (searchMinTime) params.min_created_at = formatDateTime(searchMinTime);
        if (searchMaxTime) params.max_created_at = formatDateTime(searchMaxTime);
        if (searchPlate) params.vehicle_plate = searchPlate;
        const res = await api.get(`/violations/`, { params });
        setViolations(res.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm vi phạm:", error);
      }
    };
    fetchViolations();
  }, [searchMinTime, searchMaxTime, searchPlate]);

  const handleSearch = () => {
    setSearchMinTime(inputMinTime);
    setSearchMaxTime(inputMaxTime);
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
          type="datetime-local"
          placeholder="Từ thời gian..."
          value={inputMinTime}
          onChange={(e) => setInputMinTime(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="p-2 border rounded w-auto"
        />
        <input
          type="datetime-local"
          placeholder="Đến thời gian..."
          value={inputMaxTime}
          onChange={(e) => setInputMaxTime(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="p-2 border rounded w-auto"
        />
        <input
          type="text"
          placeholder="Tìm theo biển số..."
          value={inputPlate}
          onChange={(e) => setInputPlate(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="p-2 border rounded w-auto"
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
            created_at: violation.created_at ? new Date(violation.created_at).toLocaleString() : "",
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
