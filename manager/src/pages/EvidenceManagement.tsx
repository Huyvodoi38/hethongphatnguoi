import { useState, useEffect } from "react";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const EvidenceManagement = () => {
  const [evidences, setEvidences] = useState<any[]>([]);
  const headers = ["Thời gian", "Biển số", "Loại vi phạm", "Minh chứng", "Hành động"];
  const columns = ["created_at", "plate", "category", "video_url"];
  const navigate = useNavigate();

  // Thêm state cho filter
  const [searchMinTime, setSearchMinTime] = useState("");
  const [searchMaxTime, setSearchMaxTime] = useState("");
  const [searchPlate, setSearchPlate] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [inputMinTime, setInputMinTime] = useState("");
  const [inputMaxTime, setInputMaxTime] = useState("");
  const [inputPlate, setInputPlate] = useState("");
  const [inputCategory, setInputCategory] = useState("");

  useEffect(() => {
    const fetchEvidences = async () => {
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
        if (searchCategory !== "") params.detected_category = searchCategory;
        const res = await api.get("/detected/", { params });
        setEvidences(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy minh chứng:", error);
      }
    };
    fetchEvidences();
  }, [searchMinTime, searchMaxTime, searchPlate, searchCategory]);

  const handleSearch = () => {
    setSearchMinTime(inputMinTime);
    setSearchMaxTime(inputMaxTime);
    setSearchPlate(inputPlate);
    setSearchCategory(inputCategory);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa minh chứng này?")) return;
    try {
      await api.delete(`/detected/${id}`);
      setEvidences((prev) => prev.filter((e) => e.id !== id));
      alert("Đã xóa thành công");
    } catch (error) {
      console.error("Lỗi khi xóa minh chứng:", error);
      alert("Xóa thất bại");
    }
  };

  const handleAdd = (id: number) => {
    navigate(`/qlminhchung/add/${id}`);
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý minh chứng</h1>
      {/* UI filter giống ViolationManagement */}
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
        <select
          value={inputCategory}
          onChange={(e) => setInputCategory(e.target.value)}
          className="p-2 border rounded w-auto"
        >
          <option value="">Tất cả loại</option>
          <option value="0">0 - Vượt đèn đỏ</option>
          <option value="1">1 - Quá tốc độ</option>
          <option value="2">2 - Leo vỉa hè</option>
        </select>
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
          data={evidences.map((evidence: any) => ({
            id: evidence.id,
            created_at: (() => {
              const date = new Date(new Date(evidence.created_at).getTime());
              const pad = (n: number) => n.toString().padStart(2, '0');
              return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
            })(),
            plate: evidence.vehicle?.plate,
            category: evidence.category,
            video_url: evidence.video_url ? (
              <a href={evidence.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Xem video</a>
            ) : "Không có",
          }))}
          onDetail={handleAdd}
          onDelete={handleDelete}
          onEdit={undefined}
          detailLabel="Thêm"
          detailIcon={FaPlus}
        />
      </div>
    </div>
  );
};

export default EvidenceManagement; 