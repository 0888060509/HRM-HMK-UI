import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Plane,
  Umbrella,
  Clock,
  FileText,
  ChevronRight,
  RefreshCw,
  Send,
  Inbox,
  CheckCircle2,
  XCircle,
  Camera,
  X,
  AlertTriangle,
  FastForward,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

type RequestTab = "sent" | "received";

const mockSentRequests = [
  {
    id: "RQ-SWAP-01",
    type: "swap",
    title: "Yêu cầu đổi ca",
    date: "Vừa xong",
    status: "pending-peer",
    icon: RefreshCw,
    color: "text-primary",
    detail: {
      peer: "Thanh Nhàn",
      giveShift: "Ca Sáng (20/11)",
      takeShift: "Không có",
    },
  },
  {
    id: "RQ-SWAP-04",
    type: "swap",
    title: "Yêu cầu đổi ca",
    date: "Hôm qua",
    status: "rejected-peer",
    icon: RefreshCw,
    color: "text-gray-500",
    detail: {
      peer: "Hải Đăng",
      giveShift: "Ca Sáng (18/11)",
      takeShift: "Ca Chiều (19/11)",
      rejectReason:
        'Đồng nghiệp từ chối: "Mình có việc bận đột xuất rồi bạn nhé"',
    },
  },
  {
    id: "RQ-SWAP-05",
    type: "swap",
    title: "Yêu cầu đổi ca",
    date: "Thứ 2",
    status: "rejected-manager",
    icon: RefreshCw,
    color: "text-gray-500",
    detail: {
      peer: "Trần Vũ",
      giveShift: "Ca Chiều (15/11)",
      takeShift: "Không có",
      rejectReason: 'Quản lý từ chối: "Trần Vũ chưa đủ cứng để đứng ca 1 mình"',
    },
  },
  {
    id: "RQ-001",
    type: "leave",
    title: "Nghỉ phép năm",
    date: "12/10/2023",
    status: "approved",
    icon: Umbrella,
    color: "text-gray-500",
  },
];

const mockReceivedRequests = [
  {
    id: "RQ-SYS-04",
    type: "forgot_out",
    title: "Bổ sung Check-out",
    date: "Tối qua",
    status: "action-needed",
    icon: AlertTriangle,
    color: "text-red-600",
    isActionable: true,
    detail: {
      peer: "Hệ thống báo lỗi",
      msg: "Ca làm việc tối qua đã bị đóng tự động do bạn quên check-out.",
    },
  },
  {
    id: "RQ-SYS-05",
    type: "forgot_in",
    title: "Bổ sung Check-in",
    date: "Sáng nay",
    status: "action-needed",
    icon: AlertTriangle,
    color: "text-red-600",
    isActionable: true,
    detail: {
      peer: "Hệ thống báo lỗi",
      msg: "Hệ thống không ghi nhận giờ Check-in ca sáng (21/05).",
    },
  },
  {
    id: "RQ-SWAP-02",
    type: "swap",
    title: "Lời mời đổi ca",
    date: "Vài giờ trước",
    status: "pending-peer",
    icon: RefreshCw,
    color: "text-primary",
    detail: {
      peer: "Đoàn Tú",
      giveShift: "Ca Đêm (22/11)",
      takeShift: "Ca Sáng (23/11)",
      msg: "Tuần này mình kẹt lịch học, đổi giúp mình nhé!",
    },
    isActionable: true,
  },
];

export default function Requests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RequestTab>("received");
  const [receivedRevs, setReceivedRevs] = useState(mockReceivedRequests);
  const [sentRevs, setSentRevs] = useState(mockSentRequests);

  // Create Request State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reqType, setReqType] = useState<"leave" | "ot" | "attendance">(
    "leave",
  );

  const handleAction = (id: string, action: "accept" | "reject") => {
    setReceivedRevs((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: action === "accept" ? "pending-manager" : "rejected",
            isActionable: false,
          };
        }
        return r;
      }),
    );
    alert(
      action === "accept"
        ? "Đã đồng ý đổi ca. Đang chờ Quản lý phê duyệt!"
        : "Đã từ chối yêu cầu đổi ca.",
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đã gửi yêu cầu thành công. Chờ quản lý phê duyệt.");
    setShowCreateModal(false);
  };

  const currentList = activeTab === "sent" ? sentRevs : receivedRevs;

  const renderStatus = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
            Đã duyệt
          </span>
        );
      case "rejected":
      case "rejected-peer":
      case "rejected-manager":
        return (
          <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
            Từ chối
          </span>
        );
      case "pending-peer":
        return (
          <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
            Chờ xác nhận
          </span>
        );
      case "pending-manager":
        return (
          <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
            Chờ duyệt
          </span>
        );
      case "action-needed":
        return (
          <span className="bg-red-600 text-white border border-red-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm shadow-red-200">
            Sự Cố
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">
            Chờ xử lý
          </span>
        );
    }
  };

  const [filterType, setFilterType] = useState<string>("all");
  const filteredList = currentList.filter(
    (req) => filterType === "all" || req.type === filterType,
  );

  return (
    <div className="flex flex-col h-full bg-background relative pb-20">
      <div className="bg-white px-4 py-3 sticky top-0 z-30 flex flex-col gap-3 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 pt-2">
          Yêu cầu & Phê duyệt
        </h1>

        <div className="flex gap-2 mb-1">
          <button
            onClick={() => {
              setActiveTab("received");
              setFilterType("all");
            }}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 border",
              activeTab === "received"
                ? "bg-transparent text-gray-900 border-gray-900"
                : "bg-transparent text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-400",
            )}
          >
            <Inbox
              className={cn(
                "w-4 h-4",
                activeTab === "received" ? "text-gray-900" : "text-gray-400",
              )}
            />{" "}
            Xử lý
            {receivedRevs.some((r) => r.isActionable) && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("sent");
              setFilterType("all");
            }}
            className={cn(
              "flex-1 py-2 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 border",
              activeTab === "sent"
                ? "bg-transparent text-gray-900 border-gray-900"
                : "bg-transparent text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-400",
            )}
          >
            <Send
              className={cn(
                "w-4 h-4",
                activeTab === "sent" ? "text-gray-900" : "text-gray-400",
              )}
            />{" "}
            Đã gửi
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setFilterType("all")}
            className={cn(
              "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap",
              filterType === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200",
            )}
          >
            Tất cả
          </button>
          {activeTab === "received" && (
            <>
              <button
                onClick={() => setFilterType("forgot_in")}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap",
                  filterType === "forgot_in"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-white text-gray-500 border-gray-200",
                )}
              >
                Missing Check-in
              </button>
              <button
                onClick={() => setFilterType("forgot_out")}
                className={cn(
                  "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap",
                  filterType === "forgot_out"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "bg-white text-gray-500 border-gray-200",
                )}
              >
                Missing Check-out
              </button>
            </>
          )}
          <button
            onClick={() => setFilterType("swap")}
            className={cn(
              "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap",
              filterType === "swap"
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-white text-gray-500 border-gray-200",
            )}
          >
            Đổi ca
          </button>
          <button
            onClick={() => setFilterType("leave")}
            className={cn(
              "px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap",
              filterType === "leave"
                ? "bg-gray-100 text-gray-900 border-gray-300"
                : "bg-white text-gray-500 border-gray-200",
            )}
          >
            Nghỉ phép
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${filterType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 mt-2">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-gray-900 font-bold text-base mb-1">
                  Tuế Nguyệt Tĩnh Hảo!
                </h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  Không có yêu cầu nào cần bạn xử lý lúc này.
                  <br /> Hãy tận hưởng sự bình yên nhé.
                </p>
              </div>
            ) : (
              filteredList.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    "bg-white border-2 rounded-2xl p-4 shadow-sm transition-all relative overflow-hidden",
                    req.type === "forgot_in" || req.type === "forgot_out"
                      ? "border-red-100 bg-red-50/10"
                      : req.type === "swap"
                        ? "border-blue-100"
                        : "border-gray-100",
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 border shadow-sm rounded-full flex items-center justify-center shrink-0",
                          req.type === "forgot_in" || req.type === "forgot_out"
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-gray-50 border-gray-200 text-gray-600",
                        )}
                      >
                        <req.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm mb-0.5 tracking-tight flex items-center gap-2">
                          {req.title}
                          {req.type === "swap" && (
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          )}
                          {(req.type === "forgot_in" ||
                            req.type === "forgot_out") && (
                            <span className="w-1.5 h-1.5 animate-pulse bg-red-500 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {req.detail?.peer && (
                            <span className="text-gray-400 mr-1.5">
                              TỪ: {req.detail.peer}
                            </span>
                          )}
                          • <span className="ml-1.5">{req.date}</span>
                        </p>
                      </div>
                    </div>
                    {renderStatus(req.status)}
                  </div>

                  {(req.type === "forgot_in" || req.type === "forgot_out") &&
                    req.detail && (
                      <div className="bg-white border-2 border-red-50 rounded-xl p-3 mb-3 text-sm">
                        <p className="text-xs text-red-800 font-bold leading-relaxed mb-3">
                          {req.detail.msg}
                        </p>
                        <button
                          onClick={() =>
                            navigate(`/attendance?scenario=${req.type}`)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg text-[11px] uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] w-full flex items-center justify-center gap-2"
                        >
                          Bổ sung dữ liệu <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                  {req.type === "swap" && req.detail && (
                    <div className="bg-gray-50/50 border-2 border-gray-100 rounded-xl p-4 mb-3 text-sm">
                      {req.detail.msg && (
                        <p className="text-xs text-gray-600 italic mb-4 font-medium">
                          "{req.detail.msg}"
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                        <div className="bg-white p-3 rounded-xl border-2 border-gray-100">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                            {activeTab === "received"
                              ? "Bạn lấy ca:"
                              : "Bạn bỏ ca:"}
                          </span>
                          <span className="font-bold text-gray-900 tracking-tight">
                            {req.detail.giveShift}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-xl border-2 border-gray-100">
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">
                            {activeTab === "received"
                              ? "Bạn nhường ca:"
                              : "Bồi hoàn ca:"}
                          </span>
                          <span className="font-bold text-gray-900 tracking-tight">
                            {req.detail.takeShift}
                          </span>
                        </div>
                      </div>

                      {req.detail.rejectReason && (
                        <div className="pt-3 border-t-2 border-red-100 text-xs text-red-600 font-bold flex gap-2 items-start bg-red-50 p-3 rounded-xl mt-3">
                          <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            {req.detail.rejectReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hành động (Chỉ cho tab received và đang pending) */}
                  {activeTab === "received" &&
                    req.isActionable &&
                    req.type === "swap" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(req.id, "reject")}
                          className="flex-[1] py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs flex items-center justify-center transition-all"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" /> Từ chối
                        </button>
                        <button
                          onClick={() => handleAction(req.id, "accept")}
                          className="flex-[2] py-2.5 bg-black hover:bg-gray-900 text-white font-bold rounded-xl shadow-sm text-xs flex items-center justify-center transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Đồng ý đổi
                        </button>
                      </div>
                    )}

                  {/* Hành động Hủy request (Chỉ cho tab sent) */}
                  {activeTab === "sent" && req.status === "pending-peer" && (
                    <button
                      onClick={() =>
                        setSentRevs((prev) =>
                          prev.filter((r) => r.id !== req.id),
                        )
                      }
                      className="w-full mt-2 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl text-xs transition-colors hover:bg-red-100 border border-red-100"
                    >
                      Thu hồi yêu cầu
                    </button>
                  )}
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {activeTab === "sent" && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-black rounded-full shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform z-40 hover:bg-gray-900 border border-gray-800"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* CREATE REQUEST BOTTOM SHEET */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-end"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ y: "100%", opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-md rounded-t-2xl max-h-[95vh] flex flex-col shadow-[0_-8px_30px_rgb(0,0,0,0.12)] relative"
            >
              {/* Drag Handle */}
              <div className="w-full flex justify-center pt-3 pb-2 absolute top-0 left-0 z-20">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-8 pb-4 bg-white sticky top-0 z-10 shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tạo Yêu cầu
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Chọn loại yêu cầu và điền thông tin
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto no-scrollbar pb-32">
                {/* Type Selector Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: "leave", label: "Nghỉ phép" },
                    { id: "ot", label: "Làm thêm" },
                    { id: "attendance", label: "Bổ sung công" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setReqType(t.id as any)}
                      className={cn(
                        "px-4 py-2 text-xs font-bold rounded-full transition-all border shrink-0 whitespace-nowrap",
                        reqType === t.id
                          ? "bg-transparent text-gray-900 border-gray-900"
                          : "bg-transparent text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-400",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCreateSubmit} className="space-y-6">
                  {/* --- XIN NGHỈ (LEAVE) --- */}
                  {reqType === "leave" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Loại phép
                        </label>
                        <select className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black text-gray-900 transition-all appearance-none">
                          <option value="annual">Phép năm (Còn 8 ngày)</option>
                          <option value="unpaid">Nghỉ không lương</option>
                          <option value="sick">
                            Nghỉ ốm (Cần giấy khám bệnh)
                          </option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Từ ngày
                          </label>
                          <input
                            type="date"
                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Đến ngày
                          </label>
                          <input
                            type="date"
                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Lý do
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Mô tả tóm tắt lý do xin nghỉ..."
                          className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black resize-none transition-all placeholder:text-gray-400"
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Đính kèm (Tuỳ chọn)
                        </label>
                        <div className="w-full border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 bg-gray-50/50 cursor-pointer transition-colors">
                          <div className="w-12 h-12 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                            <Camera className="w-5 h-5 text-gray-400" />
                          </div>
                          <span className="text-sm font-bold text-gray-900 mb-1">
                            Thêm ảnh / Tài liệu
                          </span>
                          <span className="text-xs font-medium text-gray-400">
                            Chụp giấy khám bệnh, hoá đơn...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- LÀM THÊM GIỜ (OT) --- */}
                  {reqType === "ot" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Ngày làm thêm
                        </label>
                        <input
                          type="date"
                          className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Từ giờ
                          </label>
                          <input
                            type="time"
                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Đến giờ
                          </label>
                          <input
                            type="time"
                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Lý do
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Ca tối đông khách, Quản lý yêu cầu ở lại hỗ trợ..."
                          className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black resize-none transition-all placeholder:text-gray-400"
                        ></textarea>
                      </div>
                    </motion.div>
                  )}

                  {/* --- BỔ SUNG CÔNG (ATTENDANCE) --- */}
                  {reqType === "attendance" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
                    >
                      <div className="bg-amber-50 text-amber-900 px-4 py-3 rounded-xl border border-amber-100 flex gap-3 text-sm font-medium">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Chỉ dùng khi quên chấm công hoặc thiết bị lỗi.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Loại yêu cầu
                        </label>
                        <select className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black text-gray-900 transition-all appearance-none">
                          <option value="in">Quên Check-in</option>
                          <option value="out">Quên Check-out</option>
                          <option value="device">Lỗi thiết bị</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Ngày làm
                          </label>
                          <input
                            type="date"
                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                            Giờ thực tế
                          </label>
                          <input
                            type="time"
                            className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-black transition-all text-gray-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                          Biện luận / Tường trình
                        </label>
                        <textarea
                          rows={3}
                          placeholder="VD: Sáng tới cửa hàng rớt mạng wifi nên không thể check in..."
                          className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-4 text-sm font-medium focus:outline-none focus:border-black resize-none transition-all placeholder:text-gray-400"
                        ></textarea>
                      </div>
                    </motion.div>
                  )}

                  {/* Absolute positioning for sticky footer effect in bottom sheet */}
                  <div className="absolute bottom-0 left-0 w-full bg-white flex p-4 pb-safe z-20">
                    <button
                      type="submit"
                      className="w-full py-4 bg-black border border-black hover:bg-gray-900 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-5 h-5" /> GỬI YÊU CẦU
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
