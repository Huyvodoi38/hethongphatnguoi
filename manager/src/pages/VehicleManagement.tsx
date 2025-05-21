import { useState, useEffect } from "react";
import ManagementTable from "../components/ManagementTable";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const headers = ["Biển số", "Tên chủ xe", "Số điện thoại", "Hành động"];
  const columns = ["plate", "fullname", "phone"];
  const navigate = useNavigate();
  const [searchPlate, setSearchPlate] = useState("");
  const [inputPlate, setInputPlate] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        let params: any = {};
        if (searchPlate) params.vehicle_plate = searchPlate;
        const res = await api.get(`/vehicles/`, { params });
        setVehicles(res.data.items || res.data);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm phương tiện:", error);
      }
    };
    fetchVehicles();
  }, [searchPlate]);

  const handleSearch = () => {
    setSearchPlate(inputPlate);
  };

  const handleDetail = (id: number) => {
    navigate(`/qlphuongtien/detail/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phương tiện này?")) return;
    try {
      await api.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      alert("Đã xóa thành công");
    } catch (error) {
      console.error("Lỗi khi xóa phương tiện:", error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="p-2">
      <h1 className="text-xl font-bold mb-4">Quản lý phương tiện</h1>
      <div className="flex gap-2 mt-4">
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
          data={vehicles.map((vehicle: any) => ({
            id: vehicle.id,
            plate: vehicle.plate,
            fullname: vehicle.user?.fullname || "",
            phone: vehicle.user?.phone || "",
          }))}
          onDetail={handleDetail}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default VehicleManagement; 