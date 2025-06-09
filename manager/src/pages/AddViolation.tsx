import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import api from "../services/api";

const AddViolation = () => {
  const [form, setForm] = useState({
    category: 0,
    plate: "",
    fine_vnd: "",
    video_url: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Giới hạn số tiền phạt theo loại vi phạm (theo quy định VN, không phân biệt loại xe)
  let minFine = 0, maxFine = 10000000;
  if (form.category === 0) { minFine = 800000; maxFine = 6000000; }
  else if (form.category === 1) { minFine = 200000; maxFine = 12000000; }
  else if (form.category === 2) { minFine = 400000; maxFine = 5000000; }

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: name === 'category' ? Number(value) : name === 'fine_vnd' ? value : value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/violations/", null, {
        params: {
          violation_category: form.category,
          vehicle_plate: form.plate,
          violation_fine_vnd: Number(form.fine_vnd),
          violation_video_url: form.video_url,
        }
      });
      setSubmitted(true);
    } catch (error: any) {
      console.error("Lỗi khi tạo vi phạm:", error);
      alert("Tạo vi phạm thất bại");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (submitted) {
    return (
      <div className="text-green-600 font-semibold text-center">
        Tạo vi phạm thành công!
        <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft} className="mt-4"/>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Thêm Vi Phạm</h1>
      <BackButton onClick={handleBack} label="Quay lại" icon={FaArrowLeft} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Loại vi phạm
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-2 border rounded shadow-sm"
              required
            >
              <option value={0}>Loại 0</option>
              <option value={1}>Loại 1</option>
              <option value={2}>Loại 2</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Biển số xe
          </label>
          <input
            type="text"
            name="plate"
            value={form.plate}
            onChange={handleChange}
            className="w-full p-2 border rounded shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Số tiền phạt (VNĐ)
          </label>
          <input
            type="number"
            name="fine_vnd"
            value={form.fine_vnd}
            onChange={handleChange}
            className="w-full p-2 border rounded shadow-sm"
            required
            min={minFine}
            max={maxFine}
          />
          <div className="text-gray-500 text-sm">
            Số tiền phạt hợp lệ: {minFine.toLocaleString()} - {maxFine.toLocaleString()} VNĐ
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            URL video/ảnh
          </label>
          <input
            type="text"
            name="video_url"
            value={form.video_url}
            onChange={handleChange}
            className="w-full p-2 border rounded shadow-sm"
            required
          />
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

export default AddViolation;