import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext";
import api from "../services/api";

function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, error, loading } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(phone, password);
      onClose();
    } catch (err: any) {
      setLocalError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl">×</button>
        <h2 className="text-xl font-bold mb-6 text-pink-600 text-center">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg"
              required
            />
          </div>
          {(localError || error) && <div className="text-red-500 text-sm text-center">{localError || error}</div>}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/users", { phone, password, fullname: fullName });
      alert("Đăng ký thành công! Hãy đăng nhập.");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl">×</button>
        <h2 className="text-xl font-bold mb-6 text-pink-600 text-center">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Họ tên</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

function RefutationModal({ open, onClose, violationId }: { open: boolean; onClose: () => void; violationId: number | null }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/refutations", { violation_id: violationId, message });
      alert("Gửi khiếu nại thành công!");
      setMessage("");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gửi khiếu nại thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!open || !violationId) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-pink-500 text-xl">×</button>
        <h2 className="text-xl font-bold mb-6 text-pink-600 text-center">Gửi khiếu nại</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nội dung khiếu nại</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg"
              rows={4}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi khiếu nại"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Home() {
  const { currentUser, logout } = useAuth();
  const [tab, setTab] = useState("search");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [licensePlate, setLicensePlate] = useState("");
  const [registration, setRegistration] = useState({ licensePlate: "", ownerName: "", phone: "" });
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showRefutation, setShowRefutation] = useState(false);
  const [refuteViolationId, setRefuteViolationId] = useState<number | null>(null);
  const [refutations, setRefutations] = useState<any[]>([]);
  const [loadingRefutations, setLoadingRefutations] = useState(false);
  const [errorRefutations, setErrorRefutations] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSearchError(null);
      const response = await api.get(`/violations/${licensePlate}`);
      setSearchResult(response.data);
    } catch (error: any) {
      setSearchError(error.response?.data?.message || "Không tìm thấy thông tin vi phạm");
      setSearchResult(null);
    }
  };


  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Vui lòng đăng nhập để đăng ký biển số!");
      return;
    }
    try {
      await api.post(`/vehicles/?vehicle_plate=${encodeURIComponent(registration.licensePlate)}`);
      alert("Đăng ký biển số thành công!");
      setRegistration({ licensePlate: "", ownerName: "", phone: "" });
    } catch (error: any) {
      alert(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  // Fetch refutations when tab changes to 'refutations' and user is logged in
  useEffect(() => {
    if (tab === "refutations" && currentUser) {
      setLoadingRefutations(true);
      setErrorRefutations(null);
      api.get("/refutations")
        .then(res => setRefutations(res.data))
        .catch(err => setErrorRefutations(err.response?.data?.message || "Không thể tải phản hồi khiếu nại"))
        .finally(() => setLoadingRefutations(false));
    }
  }, [tab, currentUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 bg-white border-b">
        <div className="text-2xl font-bold tracking-tight text-pink-600 select-none">PhatNguoi.Com</div>
        <div className="space-x-2 text-base font-normal">
          {!currentUser ? (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-1 rounded bg-pink-50 text-pink-600 hover:bg-pink-100 transition border border-pink-100"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="px-4 py-1 rounded bg-white text-gray-700 hover:bg-gray-100 transition border border-gray-200"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-700 font-medium mr-2">{currentUser.fullName || currentUser.email}</span>
              <button
                onClick={logout}
                className="px-4 py-1 rounded bg-white text-gray-700 hover:bg-gray-100 transition border border-gray-200"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </header>

      {/* Modal */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} />
      <RefutationModal open={showRefutation} onClose={() => setShowRefutation(false)} violationId={refuteViolationId} />

      {/* Main card */}
      <main className="flex justify-center mt-12">
        <div className="bg-white rounded-xl shadow-sm p-8 w-full max-w-xl border border-gray-100">
          {/* Tabs */}
          <div className="flex space-x-8 border-b mb-8">
            <button
              onClick={() => setTab("search")}
              className={`pb-2 text-lg font-semibold transition border-b-2 ${tab === "search" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400 hover:text-pink-400"}`}
            >
              Tra cứu vi phạm
            </button>
            <button
              onClick={() => setTab("refutations")}
              className={`pb-2 text-lg font-semibold transition border-b-2 ${tab === "refutations" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400 hover:text-pink-400"}`}
            >
              Xem phản hồi khiếu nại
            </button>
            <button
              onClick={() => setTab("register")}
              className={`pb-2 text-lg font-semibold transition border-b-2 ${tab === "register" ? "border-pink-500 text-pink-600" : "border-transparent text-gray-400 hover:text-pink-400"}`}
            >
              Đăng ký biển số
            </button>
          </div>

          {/* Search Tab */}
          {tab === "search" && (
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Biển số xe</label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg transition"
                  placeholder="Nhập biển số xe"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
              >
                Tra cứu
              </button>
              {searchError && (
                <div className="text-red-500 text-center text-sm mt-2">{searchError}</div>
              )}
              {searchResult && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-gray-700">Kết quả tra cứu:</h3>
                  {Array.isArray(searchResult) && searchResult.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResult.map((item: any) => (
                        <div key={item.id} className="py-3 grid grid-cols-1 gap-1">
                          <div className="text-sm text-gray-500">ID: <span className="text-gray-800 font-medium">{item.id}</span></div>
                          <div className="text-sm text-gray-500">Loại vi phạm: <span className="text-gray-800 font-medium">{item.category}</span></div>
                          <div className="text-sm text-gray-500">Biển số: <span className="text-gray-800 font-medium">{item.vehicle?.plate}</span></div>
                          <div className="text-sm text-gray-500">Số tiền phạt: <span className="text-gray-800 font-medium">{item.fine_vnd?.toLocaleString()} VNĐ</span></div>
                          <div className="text-sm text-gray-500">Bằng chứng: {item.video_url ? (
                            <a href={item.video_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">Xem video</a>
                          ) : <span className="text-gray-400">Không có</span>}</div>
                          <div>
                            <button
                              className="mt-2 px-4 py-1 rounded bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100 transition"
                              onClick={() => { setRefuteViolationId(item.id); setShowRefutation(true); }}
                            >
                              Khiếu nại
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">Không có kết quả phù hợp.</div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* Refutations Tab */}
          {tab === "refutations" && (
            <div>
              {!currentUser ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-sm text-yellow-700 rounded">
                  Vui lòng đăng nhập để xem phản hồi khiếu nại
                </div>
              ) : loadingRefutations ? (
                <div className="text-center text-gray-400">Đang tải...</div>
              ) : errorRefutations ? (
                <div className="text-center text-red-500">{errorRefutations}</div>
              ) : refutations.length === 0 ? (
                <div className="text-center text-gray-400">Bạn chưa có phản hồi khiếu nại nào.</div>
              ) : (
                <div className="space-y-4">
                  {refutations.map((r: any) => (
                    <div key={r.id} className="p-4 border rounded-lg bg-gray-50 space-y-1">
                      <div className="text-sm text-gray-500">ID khiếu nại: <span className="text-gray-800 font-medium">{r.id}</span></div>
                      <div className="text-sm text-gray-500">ID vi phạm: <span className="text-gray-800">{r.violation?.id}</span></div>
                      <div className="text-sm text-gray-500">Nội dung khiếu nại: <span className="text-gray-800">{r.message}</span></div>
                      <div className="text-sm text-gray-500">Phản hồi: <span className="text-gray-800">{r.response ?? <span className="text-gray-400">Chưa có phản hồi</span>}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Register Tab */}
          {tab === "register" && (
            <div>
              {!currentUser && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 text-sm text-yellow-700 rounded">
                  Vui lòng đăng nhập để sử dụng tính năng này
                </div>
              )}
              <form onSubmit={handleRegistration} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Biển số xe</label>
                  <input
                    type="text"
                    value={registration.licensePlate}
                    onChange={(e) => setRegistration({ ...registration, licensePlate: e.target.value })}
                    className="w-full border-b border-gray-300 bg-transparent focus:outline-none focus:border-pink-400 py-2 px-1 text-lg transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
