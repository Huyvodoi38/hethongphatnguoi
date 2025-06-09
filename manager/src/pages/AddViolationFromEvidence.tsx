import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../services/api";

const AddViolationFromEvidence = () => {
  const { id } = useParams();
  const [evidence, setEvidence] = useState<any>(null);
  const [fine, setFine] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        const res = await api.get(`/detected/?detected_id=${id}`);
        setEvidence(res.data[0]);
      } catch (error) {
        console.error("Lỗi khi lấy minh chứng:", error);
        alert("Không tìm thấy minh chứng");
        navigate(-1);
      }
    };
    fetchEvidence();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/violations/", null, {
        params: {
          violation_category: evidence.category,
          vehicle_plate: evidence.vehicle?.plate,
          violation_fine_vnd: fine,
          violation_video_url: evidence.video_url,
        }
      });
      await api.delete(`/detected/${id}`);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Lỗi khi tạo vi phạm hoặc xóa minh chứng:", error);
      alert("Tạo vi phạm hoặc xóa minh chứng thất bại");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Hàm lấy label loại vi phạm
  const getCategoryLabel = (cat: number) => {
    switch (cat) {
      case 0: return "0 - Vượt đèn đỏ";
      case 1: return "1 - Quá tốc độ";
      case 2: return "2 - Leo vỉa hè";
      default: return cat;
    }
  };

  // Giới hạn số tiền phạt theo loại vi phạm (theo quy định VN, không phân biệt loại xe)
  let minFine = 0, maxFine = 10000000;
  if (evidence) {
    if (evidence.category === 0) { minFine = 800000; maxFine = 6000000; }
    else if (evidence.category === 1) { minFine = 200000; maxFine = 12000000; }
    else if (evidence.category === 2) { minFine = 400000; maxFine = 5000000; }
  }

  if (submitted) {
    return (
      <div className="text-green-600 font-semibold text-center">
        Tạo vi phạm thành công!
        <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft} className="mt-4" />
      </div>
    );
  }

  if (!evidence) return <div>Đang tải minh chứng...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm Vi Phạm từ Minh Chứng</h1>
      <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Loại vi phạm</label>
          <input
            type="text"
            value={getCategoryLabel(evidence.category)}
            disabled
            className="w-full p-2 border rounded shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Biển số xe</label>
          <input
            type="text"
            value={evidence.vehicle?.plate || ""}
            disabled
            className="w-full p-2 border rounded shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Minh chứng (URL video/ảnh)</label>
          {evidence.video_url ? (
            <a
              href={evidence.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full p-2 bg-gray-100 text-blue-600 underline cursor-pointer rounded border border-black"
            >
              {evidence.video_url}
            </a>
          ) : (
            <div className="w-full p-2 border rounded shadow-sm bg-gray-100 text-gray-500">Không có</div>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Số tiền phạt (VNĐ)</label>
          <input
            type="number"
            value={fine}
            onChange={e => setFine(e.target.value)}
            className="w-full p-2 border rounded shadow-sm"
            required
            min={minFine}
            max={maxFine}
          />
          <div className="text-gray-500 text-sm">
            Số tiền phạt hợp lệ: {minFine.toLocaleString()} - {maxFine.toLocaleString()} VNĐ
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Tạo vi phạm
        </button>
      </form>
    </div>
  );
};

export default AddViolationFromEvidence; 