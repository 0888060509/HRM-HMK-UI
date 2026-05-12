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
