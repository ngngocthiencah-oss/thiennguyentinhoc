"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Target, 
  CalendarDays, 
  FolderGit2, 
  Share2, 
  Bell, 
  Search, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  Camera,
  ShieldCheck,
  Globe
} from "lucide-react";

export default function DashboardPage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [domainName, setDomainName] = useState<string>("thiennguyentinhoc");

  useEffect(() => {
    const savedAvatar = localStorage.getItem("goalpilot_avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
    const savedDomain = localStorage.getItem("goalpilot_domain");
    if (savedDomain) {
      setDomainName(savedDomain);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
        localStorage.setItem("goalpilot_avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDomainName(val);
    localStorage.setItem("goalpilot_domain", val);
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* 1. Sidebar bên trái */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl">
        <div>
          {/* Logo & Tên ứng dụng */}
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">GP</div>
            <div>
              <h1 className="font-bold text-base leading-tight">GoalPilot</h1>
              <p className="text-xs text-slate-400">
                {isAdminMode ? "Hệ Thống Quản Trị" : "Personal Performance"}
              </p>
            </div>
          </div>

          {/* Nút Quản Trị Viên chuyển đổi chế độ */}
          <button 
            onClick={toggleAdminMode}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-xs font-semibold transition-colors cursor-pointer border ${
              isAdminMode 
                ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-600/30" 
                : "bg-blue-900/40 border-blue-500/30 text-blue-300 hover:bg-blue-800/50"
            }`}
          >
            <ShieldCheck className={`w-4 h-4 flex-shrink-0 ${isAdminMode ? "text-white" : "text-blue-400"}`} />
            <span>{isAdminMode ? "Đang Bật Chế Độ Admin" : "Quyền Quản Trị (Admin)"}</span>
          </button>

          {/* User Info Card kèm đổi ảnh đại diện */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl mb-6 border border-slate-700/50 relative group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center font-bold text-white text-lg ring-2 ring-blue-400/30 flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>NT</span>
              )}
              
              <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-4 h-4 text-white" />
              </label>
            </div>

            <div className="overflow-hidden">
              <h2 className="font-semibold text-sm truncate text-slate-100">Nguyễn Ngọc Thiện</h2>
              <span className="text-xs text-blue-400 font-medium block truncate">ThienNguyenTinhoc</span>
            </div>

            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageChange} 
            />
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5">
            <Link href="/" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/kpi" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <Target className="w-4 h-4" /> KPI & Mục Tiêu
            </Link>
            <Link href="#" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <CalendarDays className="w-4 h-4" /> Kế Hoạch
            </Link>
            <Link href="#" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <FolderGit2 className="w-4 h-4" /> Kho Tài Liệu
            </Link>
            <Link href="/voucher" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
              <Share2 className="w-4 h-4" /> Nhận Voucher
            </Link>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="px-2 text-[11px] text-slate-500 border-t border-slate-800 pt-3">
          GoalPilot v1.0 • 2026
        </div>
      </aside>

      {/* 2. Nội dung chính bên phải */}
      <main className="flex-1 overflow-y-auto p-8 flex flex-col justify-between">
        <div>
          {/* Thanh URL giả lập phía trên có thể chỉnh sửa trực tiếp */}
          <div className="flex items-center gap-2 mb-6 bg-slate-200/60 px-4 py-2 rounded-xl border border-slate-300 w-fit">
            <Globe className="w-4 h-4 text-slate-500" />
            <div className="flex items-center text-xs font-medium text-slate-600">
              <span>localhost:3000 / </span>
              <input 
                type="text" 
                value={domainName} 
                onChange={handleDomainChange}
                className="bg-transparent font-semibold text-blue-600 outline-none ml-0.5 border-b border-dashed border-blue-400 focus:border-solid w-36"
                placeholder="nhập tên..."
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                {isAdminMode ? "Bảng Điều Khiển Quản Trị Hệ Thống" : "Tổng Quan Goals & KPI - Q3 2026"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAdminMode 
                  ? "Xin chào Admin Nguyễn Ngọc Thiện, chúc bạn một ngày làm việc hiệu quả!" 
                  : "Xin chào Nguyễn Ngọc Thiện, chúc bạn một ngày làm việc hiệu quả!"
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm nhanh..." 
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-500 w-64"
                />
              </div>
              <button className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Hàng 1: 3 Thẻ Chỉ Số Tổng Quan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tiến Độ Mục Tiêu Tổng</span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-slate-900">82%</div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+4% tuần này</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "82%" }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KPI Hoàn Thành</span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-slate-900">4 / 5</div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Đang đi đúng hướng</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: "80%" }}></div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Công Việc Hôm Nay</span>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-slate-900">7 / 10</div>
                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">70% Hoàn thành</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
          </div>

          {/* Hàng 2: Chi tiết 3 khối nội dung bên dưới */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">KPIs Chính Của Tôi</h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-200">Active</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Doanh Thu Tháng: 42M / 50M VND</span>
                    <span className="text-blue-600">84%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: "84%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Hoàn Thành Dự Án Power BI</span>
                    <span className="text-blue-600">80%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: "80%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Đào Tạo Học Viên: 8/10 Học Viên</span>
                    <span className="text-blue-600">80%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Kế Hoạch & Công Việc Hôm Nay</h3>
                <span className="text-xs text-slate-400 font-medium">07/09/2026</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 line-through">Soạn bài giảng Microsoft Access nâng cao</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 line-through">Kiểm tra báo cáo tài chính dự án Bách Hóa Xanh</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-800">Tạo link phát Combo tài liệu cho học viên</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-slate-700 line-through">Review thiết kế slide PowerPoint</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm">Quản Lý Nhận Voucher</h3>
                <Link href="/voucher" className="text-xs font-bold text-blue-600 hover:underline">Xem tất cả</Link>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Bộ Tài Liệu Power BI Cơ Bản</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">25/50 lượt</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Còn hạn</span>
                    <Link href="/voucher">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-pointer" />
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Mẫu Báo Cáo Nhân Sự Excel</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">50/50 lượt</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded">Hết lượt</span>
                    <Link href="/voucher">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-pointer" />
                    </Link>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">Combo Slide PowerPoint Chuyên Nghiệp</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">12/30 lượt</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Còn hạn</span>
                    <Link href="/voucher">
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 cursor-pointer" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}