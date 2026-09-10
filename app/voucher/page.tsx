"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Target, 
  CalendarDays, 
  FolderGit2, 
  Share2, 
  Gift, 
  Users, 
  CheckCircle2, 
  Plus, 
  Download, 
  ShieldCheck,
  Sparkles,
  Eye,
  Lock,
  Trash2,
  Image as ImageIcon,
  Wand2,
  Loader2,
  Upload
} from "lucide-react";

interface VoucherCampaign {
  id: string;
  title: string;
  code: string;
  total: number;
  remaining: number;
  bgImage: string;
  active: boolean;
}

interface ClaimedRecord {
  id: string;
  campaignId: string;
  campaignTitle: string;
  zaloName: string;
  claimedAt: string;
  deviceId: string;
}

const DEFAULT_CAMPAIGNS: VoucherCampaign[] = [
  {
    id: "c1",
    title: "Bộ Tài Liệu Power BI Cơ Bản Q3",
    code: "NNT001",
    total: 50,
    remaining: 25,
    bgImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    active: true
  },
  {
    id: "c2",
    title: "Mẫu Báo Cáo Nhân Sự Excel Chuyên Nghiệp",
    code: "NNT002",
    total: 50,
    remaining: 50,
    bgImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    active: true
  }
];

export default function VoucherPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [campaigns, setCampaigns] = useState<VoucherCampaign[]>([]);
  const [claims, setClaims] = useState<ClaimedRecord[]>([]);

  const [zaloNameInput, setZaloNameInput] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<VoucherCampaign | null>(null);
  const [successClaim, setSuccessClaim] = useState<{ campaignTitle: string; code: string; zaloName: string; bgImage: string } | null>(null);
  const [isClientView, setIsClientView] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCode, setNewCode] = useState("NNT003");
  const [newTotal, setNewTotal] = useState(30);
  const [newBgImage, setNewBgImage] = useState("https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80");
  
  const [aiPrompt, setAiPrompt] = useState("");
  const [sampleImage, setSampleImage] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let id = localStorage.getItem("goalpilot_device_id");
    if (!id) {
      id = "dev_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("goalpilot_device_id", id);
    }
    setDeviceId(id);

    const savedZalo = localStorage.getItem("goalpilot_zalo_name");
    if (savedZalo) setZaloNameInput(savedZalo);

    const savedClaims = localStorage.getItem("goalpilot_claims");
    if (savedClaims) {
      try { setClaims(JSON.parse(savedClaims)); } catch (e) { console.error(e); }
    }

    const savedCampaigns = localStorage.getItem("goalpilot_campaigns");
    if (savedCampaigns) {
      try { 
        const parsed = JSON.parse(savedCampaigns);
        setCampaigns(parsed);
        setNewCode(`NNT${String(parsed.length + 1).padStart(3, '0')}`);
      } catch (e) { console.error(e); }
    } else {
      setCampaigns(DEFAULT_CAMPAIGNS);
      localStorage.setItem("goalpilot_campaigns", JSON.stringify(DEFAULT_CAMPAIGNS));
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("goalpilot_claims", JSON.stringify(claims));
  }, [claims, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("goalpilot_campaigns", JSON.stringify(campaigns));
    localStorage.setItem("goalpilot_total_campaigns", String(campaigns.length));
    const totalIssued = campaigns.reduce((acc, c) => acc + (c.total - c.remaining), 0);
    localStorage.setItem("goalpilot_total_issued", String(totalIssued));
  }, [campaigns, isMounted]);

  if (!isMounted) return null;

  const hasClaimedThisCampaign = (campaignId: string) => {
    return claims.some(c => c.campaignId === campaignId && c.deviceId === deviceId);
  };

  const handleClaimVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !zaloNameInput.trim()) return;

    if (hasClaimedThisCampaign(selectedCampaign.id)) {
      alert("Thiết bị của bạn đã nhận voucher này rồi!");
      return;
    }

    if (selectedCampaign.remaining <= 0) {
      alert("Đã hết số lượng voucher trong đợt này!");
      return;
    }

    localStorage.setItem("goalpilot_zalo_name", zaloNameInput.trim());

    const updatedCampaigns = campaigns.map(c => {
      if (c.id === selectedCampaign.id) {
        return { ...c, remaining: c.remaining - 1 };
      }
      return c;
    });
    setCampaigns(updatedCampaigns);

    const newClaim: ClaimedRecord = {
      id: "cl_" + Date.now(),
      campaignId: selectedCampaign.id,
      campaignTitle: selectedCampaign.title,
      zaloName: zaloNameInput.trim(),
      claimedAt: new Date().toLocaleString(),
      deviceId: deviceId
    };
    setClaims([newClaim, ...claims]);

    setSuccessClaim({
      campaignTitle: selectedCampaign.title,
      code: selectedCampaign.code,
      zaloName: zaloNameInput.trim(),
      bgImage: selectedCampaign.bgImage
    });

    setSelectedCampaign(null);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    const newCamp: VoucherCampaign = {
      id: "c_" + Date.now(),
      title: newTitle.trim(),
      code: newCode.trim().toUpperCase(),
      total: Number(newTotal),
      remaining: Number(newTotal),
      bgImage: newBgImage.trim() || "https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80",
      active: true
    };

    const updated = [newCamp, ...campaigns];
    setCampaigns(updated);
    setNewTitle("");
    setNewCode(`NNT${String(updated.length + 1).padStart(3, '0')}`);
    setNewTotal(30);
    setIsCreating(false);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đợt voucher này không?")) {
      const updated = campaigns.filter(c => c.id !== id);
      setCampaigns(updated);
    }
  };

  const handleGenerateAiImage = () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);

    setTimeout(() => {
      let finalPrompt = aiPrompt.trim();
      if (sampleImage) {
        finalPrompt += ` inspired by sample style`;
      }
      const encodedPrompt = encodeURIComponent(finalPrompt + ", professional voucher card design background, 8k");
      const generatedUrl = `https://pollinations.ai/p/${encodedPrompt}?width=800&height=400&nologo=true`;
      
      setNewBgImage(generatedUrl);
      setIsGeneratingAi(false);
      setShowAiModal(false);
      setAiPrompt("");
      setSampleImage("");
    }, 1200);
  };

  const handleDownloadCanvasCard = () => {
    if (!successClaim) return;

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(40, 40, 720, 370, 24);
    ctx.fill();

    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.roundRect(70, 75, 130, 40, 8);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(`MÃ: ${successClaim.code}`, 90, 101);

    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText("Thiện Nguyễn", 730, 100);

    ctx.textAlign = "left";
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(successClaim.campaignTitle, 70, 160);

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 260);
    ctx.lineTo(730, 260);
    ctx.stroke();

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Khách hàng sở hữu:", 70, 305);

    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(successClaim.zaloName, 70, 332);

    ctx.textAlign = "right";
    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.fillText("Được cấp bởi:", 730, 305);

    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Thiện Nguyễn", 730, 332);

    const link = document.createElement("a");
    link.download = `Voucher_${successClaim.code}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const totalCampaigns = campaigns.length;
  const totalVouchersIssued = campaigns.reduce((acc, c) => acc + (c.total - c.remaining), 0);
  const totalInitial = campaigns.reduce((acc, c) => acc + c.total, 0);

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {!isClientView && (
        <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl">
          <div>
            <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800 mb-6">
              {/* Vùng chứa ảnh đại diện của bạn */}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md bg-slate-800 flex-shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                  alt="Thiện Nguyễn"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-serif italic font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 leading-tight">
                  Thiện Nguyễn
                </h1>
                <p className="text-[11px] text-slate-400 font-medium tracking-wide">Tin học tận tâm</p>
              </div>
            </div>

            <nav className="space-y-1.5">
              <Link href="/" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200">
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
              <Link href="/voucher" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                <Share2 className="w-4 h-4" /> Nhận Voucher
              </Link>
            </nav>
          </div>

          <div className="px-2 text-[11px] text-slate-500 border-t border-slate-800 pt-3">
            Thiện Nguyễn v1.0 • 2026
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {isClientView ? "🎁 Nhận Voucher Ưu Đãi Độc Quyền" : "Quản Lý & Phát Hành Voucher Tự Động"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isClientView ? "Chọn đợt ưu đãi bên dưới để nhận ngay tài liệu." : "Khách hàng nhận voucher trực tiếp qua liên kết."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsClientView(!isClientView)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                isClientView 
                  ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" 
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
            >
              {isClientView ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isClientView ? "Trở về Trang Admin" : "Xem trước Giao diện Khách"}
            </button>

            {!isClientView && (
              <button 
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Tạo Đợt Voucher Mới
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Đợt Phát Hành</span>
            <div className="text-3xl font-black text-slate-900">{totalCampaigns} đợt</div>
            <p className="text-[11px] text-slate-400">Các chiến dịch ưu đãi</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Lượt Khách Đã Lấy</span>
            <div className="text-3xl font-black text-emerald-600">{totalVouchersIssued} / {totalInitial}</div>
            <p className="text-[11px] text-slate-400">Đã phát thành công</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã Thiết Bị Định Danh</span>
            <div className="text-xs font-bold text-blue-600 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4" /> ID: {deviceId}
            </div>
            <p className="text-[11px] text-slate-400">Chống spam nhận nhiều lần</p>
          </div>
        </div>

        <div className={`grid grid-cols-1 ${isClientView ? "lg:grid-cols-1" : "lg:grid-cols-12"} gap-6`}>
          <div className={isClientView ? "w-full" : "lg:col-span-7 space-y-4"}>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
              <Gift className="w-4 h-4 text-blue-600" /> Các Đợt Voucher Đang Hoạt Động
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {campaigns.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                  Chưa có đợt voucher nào. Hãy nhấn nút "Tạo Đợt Voucher Mới" ở góc trên.
                </div>
              ) : (
                campaigns.map((camp) => {
                  const isClaimedByMe = hasClaimedThisCampaign(camp.id);
                  return (
                    <div key={camp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md">
                            Mã: {camp.code}
                          </span>
                          {camp.remaining === 0 ? (
                            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded">Hết lượt</span>
                          ) : (
                            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Đang mở</span>
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{camp.title}</h4>
                        <p className="text-xs text-slate-500">Còn lại: <b className="text-blue-600">{camp.remaining}</b> / {camp.total} lượt</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isClaimedByMe ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Bạn đã nhận
                          </span>
                        ) : (
                          <button 
                            onClick={() => setSelectedCampaign(camp)}
                            disabled={camp.remaining <= 0}
                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all"
                          >
                            Nhận Ngay
                          </button>
                        )}

                        {!isClientView && (
                          <button 
                            onClick={() => handleDeleteCampaign(camp.id)}
                            className="p-2 bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                            title="Xóa đợt này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {!isClientView && (
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-600" /> Lịch Sử Khách Nhận Voucher
              </h3>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 max-h-[380px] overflow-y-auto">
                {claims.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">Chưa có khách hàng nào nhận voucher.</div>
                ) : (
                  claims.map((cl) => (
                    <div key={cl.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold text-slate-800">👤 {cl.zaloName}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">{cl.campaignTitle}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{cl.claimedAt}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Nhận Voucher: {selectedCampaign.title}</h3>
              <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleClaimVoucher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Zalo Của Bạn *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={zaloNameInput}
                  onChange={(e) => setZaloNameInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setSelectedCampaign(null)} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm">Xác Nhận Nhận Voucher</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {successClaim && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            
            <h3 className="text-lg font-black text-slate-900">Nhận Voucher Thành Công!</h3>
            
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 text-white p-6 text-left space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold bg-blue-600 px-2.5 py-1 rounded-md uppercase tracking-wider">Mã: {successClaim.code}</span>
                <span className="text-[11px] text-blue-300 font-semibold font-serif italic">Thiện Nguyễn</span>
              </div>

              <div>
                <h4 className="text-base font-black leading-snug">{successClaim.campaignTitle}</h4>
                <div className="mt-2 pt-2 border-t border-white/20 flex justify-between items-end text-xs">
                  <div>
                    <span className="text-[10px] text-slate-300 block">Khách hàng sở hữu:</span>
                    <b className="text-amber-400 text-sm">{successClaim.zaloName}</b>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-300 block">Được cấp bởi:</span>
                    <span className="font-bold">Thiện Nguyễn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => setSuccessClaim(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl text-xs font-bold cursor-pointer">Đóng</button>
              <button onClick={handleDownloadCanvasCard} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                <Download className="w-4 h-4" /> Tải Ảnh Về Máy
              </button>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" /> Tạo Đợt Voucher Mới
              </h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Đợt / Tiêu đề ưu đãi *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ví dụ: Voucher giảm giá 20.000 đồng"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Voucher (Tự động tăng) *</label>
                <input 
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 font-medium font-mono text-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số Lượng Ban Đầu *</label>
                <input 
                  type="number"
                  required
                  min={1}
                  value={newTotal}
                  onChange={(e) => setNewTotal(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Link Ảnh Nền (URL)
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowAiModal(true)}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-blue-50 px-2 py-0.5 rounded-md"
                  >
                    <Wand2 className="w-3 h-3" /> Tạo bằng AI ✨
                  </button>
                </div>
                <input 
                  type="url"
                  placeholder="Dán link ảnh hoặc dùng AI thiết kế"
                  value={newBgImage}
                  onChange={(e) => setNewBgImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm">Xác Nhận Tạo Đợt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-blue-600" /> AI Tạo Ảnh Nền Voucher
              </h3>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">1. Mô tả ý tưởng ảnh nền:</label>
                <textarea 
                  rows={2}
                  placeholder="Ví dụ: Nền màu xanh dương hiện đại..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs outline-none focus:border-blue-500 font-medium resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-blue-600" /> 2. Bỏ Link Ảnh Voucher Mẫu (Không bắt buộc)
                </label>
                <input 
                  type="url"
                  placeholder="Dán URL ảnh mẫu để AI tham khảo phong cách..."
                  value={sampleImage}
                  onChange={(e) => setSampleImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAiModal(false)} className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer">Hủy</button>
                <button 
                  type="button" 
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  onClick={handleGenerateAiImage}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isGeneratingAi ? "Đang vẽ ảnh..." : "AI Tạo Ảnh Ngay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}