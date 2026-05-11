import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Wallet,
  CalendarIcon,
  CalendarDays,
  Users,
  ArrowRight,
  ChevronRight,
  Target,
  Flame,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const news = [
  {
    id: 1,
    title: "Chính sách bảo hiểm y tế mới áp dụng từ tháng 11",
    time: "2 giờ trước",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80",
  },
  {
    id: 2,
    title: "Thông báo: Lịch nghỉ lễ Quốc Khánh 2/9 năm nay",
    time: "1 ngày trước",
    img: "https://images.unsplash.com/photo-1511871893393-82ce9c1a50a1?w=400&q=80",
  },
];

export default function Dashboard() {
  const {
    hasCheckedIn,
    availableShifts,
    hasAcknowledgedBriefing,
    setHasAcknowledgedBriefing,
    acknowledgeDispatch,
    registeredHours,
    maxHoursPerWeek,
  } = useApp();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [missingCheckoutAlert, setMissingCheckoutAlert] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const registeredShifts = availableShifts
    .filter((t) => t.status === "approved" || t.status === "pending")
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3); // Show top 3 maybe

  return (
    <div className="w-full flex flex-col h-full relative">
      <Header />

      <div className="p-4 space-y-4 pb-20">
        {/* Timesheet Tracker */}
        <section>
          <div className="flex justify-between items-center mb-4 mt-6">
            <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.15em]">
              Phân tích công / Tuần
            </h2>
            <Link
              to="/timesheet"
              className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200 flex items-center uppercase tracking-wide transition-colors"
            >
              Chi tiết <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-card flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Thời lượng đăng ký
                </p>
                <div className="flex items-baseline gap-1.5 min-h-[32px]">
                  <span className="text-3xl font-bold font-display text-slate-900 tracking-tight">
                    {registeredHours}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    / {maxHoursPerWeek}h
                  </span>
                </div>
              </div>

              <div className="border-l border-slate-100 pl-6">
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wide">
                  Chỉ số vi phạm
                </p>
                <div className="flex items-baseline gap-1.5 min-h-[32px]">
                  <span className="text-3xl font-bold font-display text-red-500 tracking-tight">
                    45
                  </span>
                  <span className="text-[10px] font-extrabold text-red-400 uppercase">
                    Phút
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-[0.1em]">
                <span className="text-slate-500">Mức độ cam kết</span>
                <span
                  className={cn(
                    registeredHours > maxHoursPerWeek
                      ? "text-red-500"
                      : "text-slate-900",
                  )}
                >
                  {Math.round((registeredHours / maxHoursPerWeek) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden flex border border-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, (registeredHours / maxHoursPerWeek) * 100)}%` 
                  }}
                  className={cn(
                    "h-full rounded-full transition-all duration-1000",
                    registeredHours > maxHoursPerWeek
                      ? "bg-red-500"
                      : "bg-slate-900",
                  )}
                ></motion.div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] pt-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wide text-slate-400">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      registeredHours > maxHoursPerWeek
                        ? "bg-red-500"
                        : "bg-slate-900",
                    )}
                  ></span>
                  <span>
                    Hiện hữu:{" "}
                    <span className="text-slate-900 font-display text-sm ml-1 lowercase">
                      {registeredHours}h
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-red-600 font-bold font-display text-xs bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg tracking-tight flex items-center shadow-soft">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> -50.000đ
              </p>
            </div>
          </div>
        </section>

        {/* Task Overview but now Shift Overview */}
        <section>
          <div className="flex justify-between items-center mb-4 mt-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Lịch sắp tới
            </h2>
            <Link
              to="/schedule"
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center uppercase tracking-wide"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm">
            {registeredShifts.length > 0 ? (
              registeredShifts.map((shift, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={shift.id}
                  className={cn(
                    "p-4 border-b-2 border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors",
                    shift.requireHandshake
                      ? "bg-indigo-50/50 hover:bg-indigo-50 border-indigo-100"
                      : "cursor-pointer",
                  )}
                  onClick={() =>
                    !shift.requireHandshake && navigate("/schedule")
                  }
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-1 flex-1 pr-2">
                      {format(shift.date, "EEEE, dd/MM", { locale: vi })}
                      {shift.isBuddyStore && (
                        <span className="ml-2 text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md uppercase tracking-wider font-bold">
                          Điều phối
                        </span>
                      )}
                    </h3>
                    <span
                      className={cn(
                        "text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shrink-0 border",
                        shift.status === "waitlisted" ||
                          shift.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-green-50 text-green-700 border-green-200",
                      )}
                    >
                      {shift.status === "waitlisted" ||
                      shift.status === "pending"
                        ? "Chờ duyệt"
                        : "Đã duyệt"}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 gap-2 mb-3">
                    <span className="font-bold text-black border border-black/10 bg-gray-50 px-2 py-0.5 rounded-md">
                      {shift.shiftName}
                    </span>
                    <span className="font-mono font-bold text-gray-900">
                      {shift.timeStr}
                    </span>
                    <span>•</span>
                    <span className="font-bold">{shift.hours}h</span>
                  </div>

                  {shift.requireHandshake && (
                    <div className="mt-3 bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-100 rounded-xl p-3 flex flex-col relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none"></div>
                      <div className="flex items-start gap-2 relative z-10 mb-2.5">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest leading-tight mb-0.5">
                            ĐIỀU ĐỘNG NHÂN SỰ
                          </p>
                          <p className="text-[10px] text-gray-600 font-medium leading-relaxed pr-1">
                            Địa điểm ca làm:{" "}
                            <span className="font-bold text-gray-900">
                              {shift.storeName}
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeDispatch(shift.id);
                        }}
                        className="relative z-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận ngay
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500 font-medium text-center py-8">
                Bạn chưa có ca nào sắp tới.
              </p>
            )}
          </div>
        </section>

        {/* News Feed */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide mt-6">
            Bảng tin
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar -mx-4 px-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="min-w-[260px] w-[260px] snap-center bg-white border-2 border-gray-100 rounded-xl overflow-hidden shadow-sm hover:border-gray-200 transition-colors cursor-pointer"
              >
                <div className="h-32 bg-gray-100 w-full relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] text-gray-400 font-bold tracking-wide uppercase mb-1.5">
                    {item.time}
                  </p>
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-relaxed">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
