import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';

interface UserInfo {
  id: number;
  fullname: string;
  phone: string;
  permissions: number;
  vehicles_count: number;
  violations_count: number;
}

interface VehicleDetail {
  plate: string;
  violations_count: number;
  user: UserInfo;
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<VehicleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicleDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get<VehicleDetail | VehicleDetail[]>(
          `/vehicles/?vehicle_id=${id}`
        );
        if (Array.isArray(response.data)) {
          setVehicle(response.data.length > 0 ? response.data[0] : null);
        } else {
          setVehicle(response.data);
        }
      } catch (error: any) {
        setError('Không thể tải thông tin chi tiết phương tiện.');
        console.error('Lỗi khi tải chi tiết phương tiện:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicleDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Đang tải thông tin chi tiết phương tiện...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!vehicle) {
    return <div>Không tìm thấy thông tin chi tiết phương tiện.</div>;
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <FaArrowLeft className="cursor-pointer" onClick={handleBack} />
          Chi Tiết Phương Tiện
        </h1>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">Biển số xe:</span> {vehicle.plate || 'Không có'}
          </div>
          <div>
            <span className="font-semibold">Số lần vi phạm:</span> {vehicle.violations_count ?? 'Không có'}
          </div>
          <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Thông tin Chủ Sở Hữu</h2>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">ID:</span> {vehicle.user?.id ?? 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Họ tên:</span> {vehicle.user?.fullname || 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Số điện thoại:</span> {vehicle.user?.phone || 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Quyền:</span> {vehicle.user?.permissions ?? 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Số phương tiện sở hữu:</span> {vehicle.user?.vehicles_count ?? 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Số lần vi phạm:</span> {vehicle.user?.violations_count ?? 'Không có'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail; 