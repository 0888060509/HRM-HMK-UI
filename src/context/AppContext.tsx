import React, { createContext, useContext, useState, ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  employeeId: string;
  role: string;
  department: string;
  avatar: string;
  skills: string[]; // Thêm Skill Tag
};

export type ShiftSlot = {
  id: string;
  skillTag: string;
  title: string;
  current: number;
  max: number;
};

export type ShiftStatus =
  | "open"
  | "full"
  | "pending"
  | "approved"
  | "cancelled";

export type Shift = {
  id: string;
  date: Date;
  shiftName: string;
  timeStr: string;
  hours: number;
  currentStaff: number;
  maxStaff: number;
  status: ShiftStatus;
  storeName: string;
  skillTag: string; // Keep for legacy/marketplace matching or remove
  slots?: ShiftSlot[]; // Detailed skill slots
  isNew?: boolean;
  isPendingSwap?: boolean;
  isBuddyStore?: boolean;
  requireHandshake?: boolean;
  cancelReason?: string; // e.g., "no_show_replaced"
  isAdhoc?: boolean;
  adhocReason?: string;
};

type AppContextType = {
  user: User | null;
  login: (email: string, pass: string) => void;
  logout: () => void;
  hasCheckedIn: boolean;
  setHasCheckedIn: (val: boolean) => void;
  hasAcknowledgedBriefing: boolean;
  setHasAcknowledgedBriefing: (val: boolean) => void;

  // Shift Registration Management
  availableShifts: Shift[];
  registeredHours: number;
  maxHoursPerWeek: number;
  handleShiftAction: (shiftId: string, action: "register" | "cancel") => boolean;
  acknowledgeDispatch: (shiftId: string) => void;
  addAdhocShift: (
    storeName: string,
    skill: string,
    reason: string,
  ) => Shift;
};

const mockUser: User = {
  id: "u1",
  name: "Nguyễn Văn A",
  employeeId: "HMK-2023-045",
  role: "Nhân viên bán hàng (NV)",
  department: "Cửa hàng HMK Nguyễn Trãi",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  skills: ["Tư vấn", "Thu ngân"], // User này không có kỹ năng 'Kho'
};

const getNextMonday = () => {
  const d = new Date();
  d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
  return d;
};

// Generate mock shifts
const generateShifts = (): Shift[] => {
  const shifts: Shift[] = [];
  const startOfCurrentWeek = new Date();
  startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() - ((startOfCurrentWeek.getDay() + 6) % 7));
  startOfCurrentWeek.setHours(0, 0, 0, 0);

  // Helper to add shifts for a specific week offset
  const addShiftsForWeek = (weekOffset: number, statusPrefix: string) => {
    const monday = new Date(startOfCurrentWeek);
    monday.setDate(monday.getDate() + weekOffset * 7);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(monday);
      date.setDate(date.getDate() + dayOffset);

      // Add 2 shifts per day for variety
      const types = [
        { name: "Ca Sáng", time: "08:00 - 15:00", hours: 7, tag: "Tư vấn" },
        { name: "Ca Chiều", time: "15:00 - 22:00", hours: 7, tag: "Thu ngân" },
      ];

      types.forEach((type, i) => {
        const isPast = date < new Date();
        const shiftStatus: ShiftStatus = isPast ? "approved" : "open";
        
        shifts.push({
          id: `${statusPrefix}_${weekOffset}_${dayOffset}_${i}`,
          date,
          shiftName: type.name,
          timeStr: type.time,
          hours: type.hours,
          currentStaff: isPast ? 4 : 1,
          maxStaff: 5,
          status: shiftStatus,
          storeName: "HMK Nguyễn Trãi",
          skillTag: type.tag,
          slots: [
            {
              id: `${statusPrefix}_${weekOffset}_${dayOffset}_${i}_1`,
              skillTag: "Tư vấn",
              title: "Tư vấn bán hàng",
              current: isPast ? 3 : 1,
              max: 3,
            },
            {
              id: `${statusPrefix}_${weekOffset}_${dayOffset}_${i}_2`,
              skillTag: "Thu ngân",
              title: "Thu ngân",
              current: isPast ? 1 : 0,
              max: 2,
            },
          ],
        });
      });
    }
  };

  // Generate for 4 weeks: Previous, Current, Next, Future
  addShiftsForWeek(-1, "past");
  addShiftsForWeek(0, "current");
  addShiftsForWeek(1, "next");
  addShiftsForWeek(2, "future");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeekDay = new Date(today);
  nextWeekDay.setDate(today.getDate() + 7);

  const finalShifts = shifts.filter(
    (s) =>
      s.date.getTime() !== today.getTime() &&
      s.date.getTime() !== tomorrow.getTime() &&
      s.date.getTime() !== nextWeekDay.getTime()
  );

  finalShifts.push({
    id: `case_pending_today`,
    date: today,
    shiftName: "Ca Sáng",
    timeStr: "08:00 - 15:00",
    hours: 7,
    currentStaff: 4,
    maxStaff: 5,
    status: "pending",
    storeName: "HMK Nguyễn Trãi",
    skillTag: "Tư vấn",
  });

  finalShifts.push({
    id: `case_cancelled_today`,
    date: today,
    shiftName: "Ca Tối",
    timeStr: "17:00 - 23:00",
    hours: 6,
    currentStaff: 3,
    maxStaff: 5,
    status: "cancelled",
    storeName: "HMK Nguyễn Trãi",
    skillTag: "Thu ngân",
  });

  finalShifts.push({
    id: `case_handshake_today`,
    date: today,
    shiftName: "Ca Gãy",
    timeStr: "10:00 - 14:00",
    hours: 4,
    currentStaff: 5,
    maxStaff: 5,
    status: "approved",
    storeName: "HMK Cầu Giấy",
    skillTag: "Tư vấn",
    isBuddyStore: true,
    requireHandshake: true,
  });

  finalShifts.push({
    id: `case_swap_tomorrow`,
    date: tomorrow,
    shiftName: "Ca Xuyên Đêm",
    timeStr: "00:00 - 08:00",
    hours: 8,
    currentStaff: 2,
    maxStaff: 2,
    status: "approved",
    storeName: "HMK Nguyễn Trãi",
    skillTag: "Kho",
    isPendingSwap: true,
  });

  finalShifts.push({
    id: `case_approved_next_week`,
    date: nextWeekDay,
    shiftName: "Ca Sáng",
    timeStr: "08:00 - 15:00",
    hours: 7,
    currentStaff: 5,
    maxStaff: 5,
    status: "approved",
    storeName: "HMK Nguyễn Trãi",
    skillTag: "Tư vấn",
  });

  return finalShifts;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasAcknowledgedBriefing, setHasAcknowledgedBriefing] = useState(false);

  const [availableShifts, setAvailableShifts] =
    useState<Shift[]>(generateShifts());
  const maxHoursPerWeek = 60;

  const registeredHours = availableShifts
    .filter((s) => s.status === "pending" || s.status === "approved")
    .reduce((acc, curr) => acc + curr.hours, 0);

  const login = (email: string, pass: string) => {
    setTimeout(() => setUser(mockUser), 500);
  };

  const logout = () => setUser(null);

  const handleShiftAction = (
    shiftId: string,
    action: "register" | "cancel",
  ): boolean => {
    if (action === "register") {
      const targetShift = availableShifts.find((s) => s.id === shiftId);
      if (targetShift) {
        // Check overlap
        const myActiveShifts = availableShifts.filter(
          (s) =>
            (s.status === "approved" || s.status === "pending") &&
            s.date.toDateString() === targetShift.date.toDateString(),
        );

        const parseTime = (t: string) => parseInt(t.replace(":", ""), 10);
        const [tS1, tE1] = targetShift.timeStr.split(" - ").map(parseTime);

        const hasOverlap = myActiveShifts.some((s) => {
          if (!s.timeStr.includes(" - ")) return false;
          const [sS2, sE2] = s.timeStr.split(" - ").map(parseTime);
          return tS1 < sE2 && sS2 < tE1;
        });

        if (hasOverlap) {
          alert("Lỗi: Ca đăng ký bị trùng lặp thời gian với ca hiện tại của bạn!");
          return false;
        }
      }
    }

    setAvailableShifts((prev) =>
      prev.map((shift) => {
        if (shift.id === shiftId) {
          if (action === "cancel") {
            return {
              ...shift,
              status: shift.currentStaff >= shift.maxStaff ? "full" : "open",
            };
          }
          if (action === "register") {
            return { ...shift, status: "pending" };
          }
        }
        return shift;
      }),
    );
    return true;
  };

  const acknowledgeDispatch = (shiftId: string) => {
    setAvailableShifts((prev) =>
      prev.map((shift) => {
        if (shift.id === shiftId) {
          return { ...shift, requireHandshake: false };
        }
        return shift;
      }),
    );
  };

  const addAdhocShift = (storeName: string, skill: string, reason: string) => {
    const shiftStart = new Date();
    // Default maximum duration logic or similar
    const shiftEnd = new Date(shiftStart.getTime() + 8 * 60 * 60 * 1000); // 8 hours max

    const newShift: Shift = {
      id: `adhoc_${Date.now()}`,
      date: shiftStart,
      shiftName: "Ca Đột Xuất",
      timeStr: `${shiftStart.getHours()}:${shiftStart.getMinutes().toString().padStart(2, "0")} - ${shiftEnd.getHours()}:${shiftEnd.getMinutes().toString().padStart(2, "0")}`,
      hours: 8,
      currentStaff: 1,
      maxStaff: 1,
      status: "approved", // adhoc is basically self-approved for check-in
      storeName: storeName,
      skillTag: skill,
      isAdhoc: true,
      adhocReason: reason,
    };

    alert("Bạn đang tạo 1 ca đột xuất. Record này sẽ được gán cờ Flagged_Exception chờ Quản lý duyệt.");

    setAvailableShifts((prev) => [...prev, newShift]);
    return newShift;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        hasCheckedIn,
        setHasCheckedIn,
        hasAcknowledgedBriefing,
        setHasAcknowledgedBriefing,
        availableShifts,
        registeredHours,
        maxHoursPerWeek,
        handleShiftAction,
        acknowledgeDispatch,
        addAdhocShift,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined)
    throw new Error("useApp must be used within AppProvider");
  return context;
}
