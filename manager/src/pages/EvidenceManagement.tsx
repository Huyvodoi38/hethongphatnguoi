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

  useEffect(() => {
    const fetchEvidences = async () => {
      try {
        const res = await api.get("/detected/");
        setEvidences(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy minh chứng:", error);
      }
    };
    fetchEvidences();
  }, []);

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