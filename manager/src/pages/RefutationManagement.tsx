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
    const [searchMinTime, setSearchMinTime] = useState("");
    const [searchMaxTime, setSearchMaxTime] = useState("");
    const [inputMinTime, setInputMinTime] = useState("");
    const [inputMaxTime, setInputMaxTime] = useState("");
    const navigate = useNavigate();
    const headers = ["ID", "ID vi phạm", "Biển số", "Ngày tạo", "Hành động"];
    const columns = ["id", "violation_id", "plate", "created_at"];

    useEffect(() => {
        const fetchRefutations = async () => {
            try {
                const params: any = {};
                const formatDateTime = (value: string) => {
                    if (!value) return value;
                    if (value.length === 16) value += ':00';
                    if (!value.endsWith('Z')) value += 'Z';
                    return value;
                };
                if (searchId) params.violation_id = searchId;
                if (searchPlate) params.vehicle_plate = searchPlate;
                if (searchMinTime) params.min_created_at = formatDateTime(searchMinTime);
                if (searchMaxTime) params.max_created_at = formatDateTime(searchMaxTime);
                const res = await api.get("/refutations/", { params });
                setRefutations(res.data.items || res.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu khiếu nại:", error);
            }
        };
        fetchRefutations();
    }, [searchId, searchPlate, searchMinTime, searchMaxTime]);

    const handleDetail = (id: number) => {
        navigate(`/qlkhieunai/detail/${id}`);
    };

    const handleSearch = () => {
        setSearchId(inputId);
        setSearchPlate(inputPlate);
        setSearchMinTime(inputMinTime);
        setSearchMaxTime(inputMaxTime);
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
                    placeholder="Tìm theo ID..."
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
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
                    data={refutations.map((item: any) => ({
                        id: item.id,
                        violation_id: item.violation?.id,
                        plate: item.violation?.vehicle?.plate || "N/A",
                        created_at: item.created_at ? new Date(item.created_at).toLocaleString() : "",
                    }))}
                    onDetail={handleDetail}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default RefutationManagement;
