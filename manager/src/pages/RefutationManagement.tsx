import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ManagementTable from "../components/ManagementTable";

const RefutationManagement = () => {
    const [refutations, setRefutations] = useState<any[]>([]);
    const [inputId, setInputId] = useState("");
    const [inputPlate, setInputPlate] = useState("");
    const [searchId, setSearchId] = useState("");
    const [searchPlate, setSearchPlate] = useState("");
    const navigate = useNavigate();
    const headers = ["ID", "ID vi phạm", "Biển số", "Hành động"];
    const columns = ["id", "violation_id", "plate"];

    useEffect(() => {
        const fetchRefutations = async () => {
            try {
                const params: any = {};
                if (searchId) params.violation_id = searchId;
                if (searchPlate) params.vehicle_plate = searchPlate;
                const res = await api.get("/refutations/", { params });
                setRefutations(res.data.items || res.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu khiếu nại:", error);
            }
        };
        fetchRefutations();
    }, [searchId, searchPlate]);

    const handleDetail = (id: number) => {
        navigate(`/qlkhieunai/detail/${id}`);
    };

    const handleSearch = () => {
        setSearchId(inputId);
        setSearchPlate(inputPlate);
    };
    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khiếu nại này?")) return;
        try {
            await api.delete(`/refutations/${id}`);
            setRefutations((prev) => prev.filter((r) => r.id !== id));
            alert("Đã xóa thành công");
        } catch (error) {
            console.error("Lỗi khi xóa khiếu nại:", error);
            alert("Xóa thất bại");
        }
    };

    return (
        <div className="p-2">
            <h1 className="text-xl font-bold mb-4">Quản lý khiếu nại</h1>
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
                    data={refutations.map((item: any) => ({
                        id: item.id,
                        violation_id: item.violation?.id,
                        plate: item.violation?.vehicle?.plate || "N/A",
                    }))}
                    onDetail={handleDetail}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default RefutationManagement;
