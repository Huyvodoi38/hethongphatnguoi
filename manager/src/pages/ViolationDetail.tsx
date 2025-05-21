import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';

interface ViolationDetail {
  category: number;
  plate: string;
  fine_vnd: number;
  video_url: string;
  id: number;
  refutations_count: number;
  transaction_id: number;
}

const ViolationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [violation, setViolation] = useState<ViolationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchViolationDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get<ViolationDetail | ViolationDetail[]>(
          `/violations/?violation_id=${id}`
        );
        if (Array.isArray(response.data)) {
          setViolation(response.data.length > 0 ? response.data[0] : null);
        } else {
          setViolation(response.data);
        }
      } catch (error: any) {
        setError('Không thể tải thông tin chi tiết vi phạm.');
        console.error('Lỗi khi tải chi tiết vi phạm:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchViolationDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Đang tải thông tin chi tiết...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!violation) {
    return <div>Không tìm thấy thông tin chi tiết vi phạm.</div>;
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <FaArrowLeft className="cursor-pointer" onClick={handleBack} />
          Chi Tiết Vi Phạm
        </h1>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">ID:</span> {violation?.id ?? 'Không có'}
          </div>
          <div>
            <span className="font-semibold">Loại vi phạm:</span> {violation?.category ?? 'Không có'}
          </div>
          <div>
            <span className="font-semibold">Biển số xe:</span> {violation?.plate || 'Không có'}
          </div>
          <div>
            <span className="font-semibold">Số tiền phạt:</span> {typeof violation?.fine_vnd === 'number' ? violation.fine_vnd + ' VNĐ' : 'Không có'}
          </div>
          <div>
            <span className="font-semibold">URL Video/Ảnh:</span>
            {violation?.video_url ? (
              <a href={violation.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                Xem tại đây
              </a>
            ) : (
              <span className="ml-1">Không có</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Số lần khiếu nại:</span> {violation?.refutations_count ?? 'Không có'}
          </div>
          <div>
            <span className="font-semibold">ID giao dịch:</span> {violation?.transaction_id ?? 'Không có'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetail;