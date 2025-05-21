import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';

interface ViolationInfo {
  category: number;
  plate: string;
  fine_vnd: number;
  video_url: string;
  id: number;
  refutations_count: number;
  transaction_id: number;
}

interface RefutationDetail {
  id: number;
  message: string;
  response: string;
  violation: ViolationInfo;
}

const RefutationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [refutation, setRefutation] = useState<RefutationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [responseInput, setResponseInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchRefutationDetail = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await api.get<RefutationDetail | RefutationDetail[]>(
          `/refutations/?refutation_id=${id}`
        );
        if (Array.isArray(response.data)) {
          setRefutation(response.data.length > 0 ? response.data[0] : null);
        } else {
          setRefutation(response.data);
        }
      } catch (error: any) {
        setError('Không thể tải thông tin chi tiết khiếu nại.');
        console.error('Lỗi khi tải chi tiết khiếu nại:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRefutationDetail();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseInput.trim() || !refutation) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await api.post('/refutations/response', {
        refutation_id: refutation.id,
        response: responseInput.trim(),
      });
      setRefutation((prev) => prev ? { ...prev, response: responseInput.trim() } : prev);
      setResponseInput('');
    } catch (err: any) {
      setSubmitError('Gửi phản hồi thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Đang tải thông tin chi tiết khiếu nại...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!refutation) {
    return <div>Không tìm thấy thông tin chi tiết khiếu nại.</div>;
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-[60vh] bg-gray-50">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <FaArrowLeft className="cursor-pointer" onClick={handleBack} />
          Chi Tiết Khiếu Nại
        </h1>
        <div className="space-y-3">
          <div>
            <span className="font-semibold">ID Khiếu Nại:</span> {refutation.id ?? 'Không có'}
          </div>
          <div>
            <span className="font-semibold">Nội dung khiếu nại:</span> {refutation.message || 'Không có'}
          </div>
          <div>
            <span className="font-semibold">Phản hồi:</span> {refutation.response || 'Chưa có phản hồi'}
          </div>

          {!refutation.response && (
            <form onSubmit={handleResponseSubmit} className="mt-4 space-y-2">
              <textarea
                className="w-full border rounded p-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập phản hồi..."
                value={responseInput}
                onChange={e => setResponseInput(e.target.value)}
                disabled={submitting}
              />
              <div className="flex gap-2 items-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-60"
                  disabled={submitting || !responseInput.trim()}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi phản hồi'}
                </button>
                {submitError && <span className="text-red-500 text-sm">{submitError}</span>}
              </div>
            </form>
          )}

          <h2 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Thông tin Vi Phạm Liên Quan</h2>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">ID Vi Phạm:</span> {refutation.violation?.id ?? 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Loại vi phạm:</span> {refutation.violation?.category ?? 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Biển số xe:</span> {refutation.violation?.plate || 'Không có'}
            </div>
            <div>
              <span className="font-semibold">Số tiền phạt:</span> {typeof refutation.violation?.fine_vnd === 'number' ? refutation.violation.fine_vnd + ' VNĐ' : 'Không có'}
            </div>
            <div>
              <span className="font-semibold">URL Video/Ảnh:</span>
              {refutation.violation?.video_url ? (
                <a
                  href={refutation.violation.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline ml-1"
                >
                  Xem tại đây
                </a>
              ) : (
                <span className="ml-1">Không có</span>
              )}
            </div>
            <div>
              <span className="font-semibold">Số lần khiếu nại:</span> {refutation.violation?.refutations_count ?? 'Không có'}
            </div>
            <div>
              <span className="font-semibold">ID giao dịch:</span> {refutation.violation?.transaction_id ?? 'Không có'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefutationDetail;