import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  CheckSquare,
  FileText,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "system" | "task" | "approval";

interface NotificationProps {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const mockNotifications: NotificationProps[] = [
  {
    id: "app-1",
    type: "approval",
    title: "Kết quả duyệt: Bổ sung Check-out",
    message:
      "Ticket của bạn (Ca Sáng, 21/05) đã được duyệt: Hợp lệ hóa do Lỗi hệ thống. Phần Check-out đã được cập nhật thành 12:00. Bạn có thể xem chi tiết trong Lịch sử chấm công.",
    time: "2 phút trước",
    isRead: false,
  },
  {
    id: "app-2",
    type: "approval",
    title: "Kết quả duyệt: Đi trễ",
    message:
      "Ticket của bạn (Ca Tối, 20/05) đã được duyệt: Khấu trừ UT 15 phút và Áp dụng mức phạt Đi trễ 50,000đ.",
    time: "10 phút trước",
    isRead: false,
  },
  {
    id: "ns-1",
    type: "system",
    title: "Ca làm việc đã bị tước (No-show)",
    message:
      "Quản lý đã Handshake thay thế nhân sự cho Ca Chiều (Hôm nay) do bạn No-show quá hạn. Ca này đã bị Hủy trong Lịch làm việc của bạn.",
    time: "Vài giây trước",
    isRead: false,
  },
  {
    id: "sys-1",
    type: "system",
    title: "Tự động gọt giờ (Smart Overlap)",
    message:
      "[Xung đột Lịch] Hệ thống tự động cấn trừ 30 phút (Travel Time) ca Sáng do bạn có ca Tối liền kề lúc 15:00 tại Cầu Giấy.",
    time: "5 phút trước",
    isRead: false,
  },
  {
    id: "sys-2",
    type: "system",
    title: "Phân công khẩn cấp (Chi viện Vận hành)",
    message:
      "Bạn được phân công khẩn cấp vào vị trí 'Kho'. Hành động điều động chéo chuyên môn đã được lưu Audit Log đỏ.",
    time: "20 phút trước",
    isRead: false,
  },
  {
    id: "0",
    type: "system",
    title: "Lịch làm việc tuần sau đã công bố!",
    message:
      "Bạn có 1 ca Điều phối làm việc tại cửa hàng khác (HMK Cầu Giấy). Vui lòng kiểm tra Lịch cá nhân.",
    time: "1 giờ trước",
    isRead: false,
  },
  {
    id: "1",
    type: "system",
    title: "Thông báo hệ thống",
    message: "Hệ thống sẽ bảo trì từ 23:00 đến 02:00 sáng mai.",
    time: "10 phút trước",
    isRead: false,
  },
  {
    id: "2",
    type: "task",
    title: "Bạn được giao công việc mới",
    message: "Set up quầy kệ trưng bày sản phẩm mới. Hạn chót: 15:00 hôm nay.",
    time: "1 giờ trước",
    isRead: false,
  },
  {
    id: "3",
    type: "approval",
    title: "Đơn xin nghỉ phép đã được phê duyệt",
    message: "Đơn nghỉ phép ngày 25/11 của bạn đã được CHT phê duyệt.",
    time: "2 giờ trước",
    isRead: true,
  },
  {
    id: "4",
    type: "system",
    title: "Chính sách mới",
    message: "Vui lòng đọc và xác nhận chính sách đi trễ/về sớm mới cập nhật.",
    time: "Hôm qua",
    isRead: true,
  },
  {
    id: "5",
    type: "task",
    title: "Công việc sắp đến hạn",
    message: 'Công việc "kiểm kho cuối ngày" còn 30 phút nữa đến hạn.',
    time: "Hôm qua",
    isRead: true,
  },
  {
    id: "6",
    type: "approval",
    title: "Chờ duyệt đổi ca",
    message:
      "Nhân viên Minh Tuấn muốn đổi ca Chờ xác nhận của bạn (Thứ 6, 21/11).",
    time: "2 ngày trước",
    isRead: true,
  },
];

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const tabs: { id: "all" | NotificationType; label: string }[] = [
    { id: "all", label: "Tất cả" },
    { id: "system", label: "Hệ thống" },
    { id: "task", label: "Công việc" },
    { id: "approval", label: "Phê duyệt" },
  ];

  const filtered = notifications.filter(
    (n) => activeTab === "all" || n.type === activeTab,
  );

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "system":
        return <Bell className="w-5 h-5 text-indigo-500" />;
      case "task":
        return <CheckSquare className="w-5 h-5 text-amber-500" />;
      case "approval":
        return <FileText className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getBg = (type: NotificationType) => {
    switch (type) {
      case "system":
        return "bg-indigo-50 border-indigo-100";
      case "task":
        return "bg-amber-50 border-amber-100";
      case "approval":
        return "bg-emerald-50 border-emerald-100";
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="mobile-container bg-background flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-30 shadow-sm border-b-2 border-gray-100 flex flex-col">
        <div className="flex items-center justify-between mb-4 pt-safe">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 -ml-2 rounded-md flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 ml-1">Thông báo</h1>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-bold text-indigo-600 uppercase tracking-wide hover:underline"
          >
            Đọc tất cả
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 uppercase tracking-wide flex items-center gap-1.5",
                activeTab === tab.id
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-900",
              )}
            >
              {tab.label}
              {tab.id === "all" && notifications.some((n) => !n.isRead) ? (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 line-block"></span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full bg-gray-50/50">
        {filtered.length > 0 ? (
          <div className="p-4 space-y-3">
            {filtered.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleMarkAsRead(notification.id)}
                className={cn(
                  "p-4 bg-white border-2 rounded-xl transition-all cursor-pointer active:scale-[0.98] shadow-sm relative overflow-hidden",
                  !notification.isRead
                    ? "border-indigo-100 shadow-md"
                    : "border-gray-100 opacity-80",
                )}
              >
                {!notification.isRead && (
                  <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 blur-[2px]"></div>
                )}
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2",
                        getBg(notification.type),
                      )}
                    >
                      {getIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <h3
                        className={cn(
                          "text-sm tracking-tight leading-snug break-words",
                          !notification.isRead
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-500",
                        )}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0 whitespace-nowrap pt-0.5 border border-gray-100 bg-gray-50 px-1.5 py-0.5 rounded-md">
                        {notification.time}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-xs leading-relaxed max-w-[280px]",
                        !notification.isRead
                          ? "text-gray-600 font-medium"
                          : "text-gray-400 font-medium",
                      )}
                    >
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-24 h-24 bg-white border-2 border-dashed border-gray-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Không có thông báo nào
            </p>
            <p className="text-gray-500 text-xs mt-1.5 font-medium">
              Góc làm việc của bạn đang rất gọn gàng!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
