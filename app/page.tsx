import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-6">
        <div>
          <h1 className="text-xl font-bold mb-1">GoalPilot</h1>
          <p className="text-xs text-slate-400 mb-8">Personal Performance</p>
          <nav className="space-y-2">
            <a href="#" className="block px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium">Dashboard</a>
            <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300">KPI & Mục Tiêu</a>
            <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300">Kế Hoạch</a>
            <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300">Kho Tài Liệu</a>
            <a href="#" className="block px-4 py-2.5 rounded-xl hover:bg-slate-800 text-slate-300">Nhận Voucher</a>
          </nav>
        </div>
        
        {/* Khu vực chứa nút Đăng nhập / Đăng ký */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            href="/login"
            className="block w-full py-2.5 px-4 text-center text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
          >
            Đăng Nhập / Đăng Ký
          </Link>
          <p className="text-xs text-slate-500 text-center">GoalPilot v1.0 • 2026</p>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Tổng Quan Goals & KPI - Q3 2026</h2>
            <p className="text-sm text-slate-500">Xin chào Nguyễn Ngọc Thiện, chúc bạn một ngày làm việc hiệu quả!</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">TIẾN ĐỘ MỤC TIÊU TỔNG</h3>
            <div className="text-3xl font-bold mb-3">82%</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full w-[82%]"></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">KPI HOÀN THÀNH</h3>
            <div className="text-3xl font-bold mb-3">4 / 5</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[80%]"></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">CÔNG VIỆC HÔM NAY</h3>
            <div className="text-3xl font-bold mb-3">7 / 10</div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-600 h-full w-[70%]"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}