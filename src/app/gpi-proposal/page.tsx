"use client";

import React, { useMemo, useState } from "react";
import { Banknote, Building2, Database, Fingerprint, Languages, MapPinned, PackageCheck, PhoneCall, Sprout, Truck, UserCheck, WalletCards, WifiOff } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const money = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });
// data arrays unchanged
const kpis = [
  { label: "Procurement Centers", value: "92", note: "Punjab-wide storage units", icon: Building2 },
  { label: "Pilot Districts", value: "8–10", note: "One live procurement cycle", icon: MapPinned },
  { label: "Payment Target", value: "48–72h", note: "After verified weighment", icon: WalletCards },
  { label: "Bardana Control", value: "99%+", note: "Serialized bag reconciliation", icon: PackageCheck },
];
const districtData = [
  { district: "Sahiwal", farmers: 18420, procured: 82, payments: 76, bardana: 97 },
  { district: "Okara", farmers: 21180, procured: 76, payments: 71, bardana: 96 },
  { district: "Vehari", farmers: 16940, procured: 68, payments: 64, bardana: 94 },
  { district: "Khanewal", farmers: 19875, procured: 71, payments: 67, bardana: 95 },
  { district: "Bahawalnagar", farmers: 23890, procured: 64, payments: 59, bardana: 93 },
  { district: "Pakpattan", farmers: 14620, procured: 59, payments: 55, bardana: 92 },
];
const farmerCases = [
  { id: "GPI-PB-00018472", name: "Muhammad Akram", father: "Allah Ditta", district: "Okara", tehsil: "Depalpur", village: "Chak 38/D", cnic: "35202-****-123-7", mobile: "0300-***-2187", acres: 12.5, crop: "Wheat", khasra: "214/7, 215/2", bank: "Bank of Punjab", iban: "PK36 BPUN **** 6721", request: "420 maunds", approved: "395 maunds", bardana: "790 bags", weight: "386.4 maunds", grade: "A-", payment: 1506960, status: "Paid via Raast", statusTone: "emerald" },
  { id: "GPI-PB-00021984", name: "Bashir Ahmad", father: "Ghulam Rasool", district: "Vehari", tehsil: "Mailsi", village: "Mauza Fatehpur", cnic: "36601-****-441-3", mobile: "0301-***-5529", acres: 7.0, crop: "Wheat", khasra: "91/3, 91/4", bank: "JazzCash Wallet", iban: "PK91 JAZZ **** 1104", request: "250 maunds", approved: "218 maunds", bardana: "436 bags", weight: "211.8 maunds", grade: "B+", payment: 825000, status: "Finance Approval", statusTone: "amber" },
  { id: "GPI-PB-00023210", name: "Safia Bibi", father: "Late Muhammad Din", district: "Sahiwal", tehsil: "Chichawatni", village: "Chak 110/12-L", cnic: "36502-****-904-2", mobile: "0345-***-8112", acres: 4.5, crop: "Wheat", khasra: "55/1", bank: "Easypaisa Wallet", iban: "PK44 EPAY **** 3019", request: "160 maunds", approved: "142 maunds", bardana: "284 bags", weight: "139.6 maunds", grade: "A", payment: 544440, status: "Ready for Payment", statusTone: "sky" },
];
const workflowSteps = [
  { title: "Farmer Registration", icon: Fingerprint, app: "Farmer App / Field Officer Tablet", action: "CNIC, thumb verification, mobile OTP, village address, and PLRA land data are captured.", dummy: "Muhammad Akram registered with 12.5 verified acres in Depalpur, Okara.", controls: ["NADRA Verisys", "CNIC uniqueness", "Mobile OTP", "PLRA acreage check"] },
  { title: "Intent to Sell", icon: Sprout, app: "Farmer App / USSD / Center Desk", action: "Farmer requests quantity and delivery window. System calculates eligible quota using verified acres and district yield benchmark.", dummy: "Requested 420 maunds; approved 395 maunds based on acreage and benchmark yield.", controls: ["Quota cap", "Officer review", "District benchmark", "Audit trail"] },
  { title: "Bardana Issuance", icon: PackageCheck, app: "Procurement Center Console", action: "Serialized bags are issued and mapped to Farmer ID. Farmer receives SMS with serial range and delivery date.", dummy: "790 bags issued: OKR-DPL-2026-008110 to OKR-DPL-2026-008899.", controls: ["Barcode/RFID", "Issue ledger", "Return tracking", "Leakage alert"] },
  { title: "Gate + Quality + Weighment", icon: Truck, app: "Gate Kiosk + Quality App + Weighbridge API", action: "QR code is scanned, bardana serials matched, quality tested, photos captured, and weighbridge sends weight directly.", dummy: "Net weight 386.4 maunds, Grade A-, moisture 10.8%, foreign matter 1.1%.", controls: ["No manual weight", "Photo evidence", "GPS timestamp", "Second approval above threshold"] },
  { title: "Payment Approval", icon: WalletCards, app: "Finance Console", action: "Voucher is generated automatically and approved by Procurement Officer, Storage Manager, then Finance.", dummy: "Payment voucher PKR 1,506,960 generated and pushed to Raast after three-tier approval.", controls: ["Maker-checker", "ATI bank title match", "Voucher hash", "Daily reconciliation"] },
  { title: "Inventory & Storage", icon: Database, app: "Storage Manager Console", action: "Batch is allocated to godown, stack, lot, and quality profile. FIFO, fumigation, transfers, and releases are tracked.", dummy: "Batch allocated to Okara Center, Godown 03, Stack 12, Lot OKR-WHT-2026-0441.", controls: ["Stack ledger", "Variance alerts", "Digital gate pass", "FIFO release"] },
];
const paymentTrend = [{ day: "Day 1", manual: 92, digital: 72 },{ day: "Day 7", manual: 88, digital: 58 },{ day: "Day 14", manual: 81, digital: 45 },{ day: "Day 21", manual: 78, digital: 39 },{ day: "Day 30", manual: 74, digital: 33 }];
const riskData = [{ name: "Bardana Leakage", value: 31 },{ name: "Ghost Farmers", value: 22 },{ name: "Weighbridge", value: 18 },{ name: "Payment Fraud", value: 16 },{ name: "Inventory Gaps", value: 13 }];
const exceptionRows = [{ type: "Bank title mismatch", district: "Bahawalnagar", case: "CNIC name differs from wallet title", action: "Blocked until field verification" },{ type: "Excess quantity request", district: "Vehari", case: "Request exceeds verified acreage yield", action: "Sent to Procurement Officer" },{ type: "Missing bardana return", district: "Okara", case: "26 bags not scanned at inbound", action: "Auto alert to center in-charge" },{ type: "Weight anomaly", district: "Sahiwal", case: "Repeated weights above district average", action: "Second officer countersignature required" }];
const localDesign = [{ title: "Urdu + Punjabi first", text: "Farmer app uses simple Urdu/Punjabi labels, voice prompts, and icon-led screens for low-literacy users.", icon: Languages },{ title: "Assisted onboarding", text: "Field Officer registers farmers at village, union council, or center using biometric tablet and mobile OTP.", icon: UserCheck },{ title: "Feature phone support", text: "SMS, IVR, and USSD provide request status, bardana slip, receipt, and payment confirmation.", icon: PhoneCall },{ title: "Offline center operations", text: "Each procurement center can keep working during weak 4G using encrypted offline queues and edge sync.", icon: WifiOff },{ title: "Local land language", text: "Khasra, Khewat, Mauza, Tehsil, District, tenancy and Patwari verification are built into the form design.", icon: MapPinned },{ title: "Trust-building payments", text: "Farmer sees voucher, approval stage, bank reference, and SMS confirmation instead of waiting blindly.", icon: Banknote }];
const roadmap=[{ phase: "01", title: "Discovery & Field Mapping", duration: "6–8 weeks", output: "Visit sample centers, map manual process, confirm PLRA/NADRA/bank integration, finalize KPIs." },{ phase: "02", title: "Prototype for CEO Approval", duration: "4–6 weeks", output: "Clickable farmer journey, center console, finance console, and executive dashboard demo." },{ phase: "03", title: "Core Build + Integrations", duration: "16–20 weeks", output: "Apps, APIs, database, audit log, bardana, weighment, payment, inventory, reporting." },{ phase: "04", title: "Pilot in 8–10 Districts", duration: "12–16 weeks", output: "Live procurement cycle, daily issue room, farmer helpdesk, center support, KPI report." },{ phase: "05", title: "Province Rollout", duration: "20–28 weeks", output: "All 92 centers, training, hardware deployment, helpdesk, command center, managed service." }];
const colors = ["#22c55e", "#84cc16", "#38bdf8", "#f59e0b", "#a78bfa"];
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

const SectionTitle = ({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) => <div className="mx-auto mb-10 max-w-4xl text-center"><p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p><h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">{title}</h2>{subtitle ? <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">{subtitle}</p> : null}</div>;
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={cx("rounded-[1.7rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-xl", className)}>{children}</div>;
const StatusPill = ({ tone, children }: { tone: string; children: React.ReactNode }) => <span className={cx("rounded-full border px-3 py-1 text-xs font-semibold", tone === "amber" ? "border-amber-300/30 bg-amber-300/15 text-amber-100" : tone === "sky" ? "border-sky-300/30 bg-sky-300/15 text-sky-100" : "border-emerald-300/30 bg-emerald-300/15 text-emerald-100")}>{children}</span>;

export default function GPIProposalApp() {
  const [activeStep] = useState(workflowSteps[0]);
  const [activeFarmer] = useState(farmerCases[0]);
  const [activeDistrict, setActiveDistrict] = useState(districtData[0]);
  const [activeRisk, setActiveRisk] = useState(riskData[0]);
  const [paymentPoint, setPaymentPoint] = useState(paymentTrend[0]);
  const progress = useMemo(() => workflowSteps.findIndex((s) => s.title === activeStep.title) + 1, [activeStep]);
  const districtInsights = useMemo(() => ({ gap: activeDistrict.procured - activeDistrict.payments, estBacklog: Math.round((activeDistrict.procured - activeDistrict.payments) / 100 * activeDistrict.farmers) }), [activeDistrict]);

  return <main className="min-h-screen overflow-hidden bg-[#06140c] text-slate-100">{/* keep existing layout mostly */}
  <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06140c]/80 backdrop-blur-xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><h1 className="font-bold text-white">Digital Wheat Procurement Proposal</h1></div></header>
  <section className="mx-auto max-w-7xl px-5 py-14"><SectionTitle eyebrow="CEO Dashboard" title="Clickable analytics and deeper insight" subtitle="Click bars, slices and timeline points to inspect operational impact instantly." />
  <div className="grid gap-6 lg:grid-cols-2">
  <Card className="p-6"><h3 className="text-xl font-bold text-white">District Procurement Progress</h3><p className="mt-2 text-sm text-slate-400">Click a bar to inspect district details.</p><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={districtData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="district" tick={{ fill: "#cbd5e1", fontSize: 11 }} /><YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} /><Tooltip /><Bar dataKey="procured" fill="#34d399" onClick={(entry) => { const payload = (entry as { payload?: (typeof districtData)[number] }).payload; if (payload) setActiveDistrict(payload); }} /><Bar dataKey="payments" fill="#38bdf8" onClick={(entry) => { const payload = (entry as { payload?: (typeof districtData)[number] }).payload; if (payload) setActiveDistrict(payload); }} /></BarChart></ResponsiveContainer></div></Card>
  <Card className="p-6"><h3 className="text-xl font-bold text-white">District drilldown: {activeDistrict.district}</h3><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border border-white/10 p-3">Farmers: {money.format(activeDistrict.farmers)}</div><div className="rounded-2xl border border-white/10 p-3">Procured: {activeDistrict.procured}%</div><div className="rounded-2xl border border-white/10 p-3">Payments: {activeDistrict.payments}%</div><div className="rounded-2xl border border-white/10 p-3">Bardana: {activeDistrict.bardana}%</div></div><p className="mt-4 text-emerald-200">Payment lag: {districtInsights.gap}% (~{money.format(districtInsights.estBacklog)} farmers pending payout)</p></Card>
  <Card className="p-6"><h3 className="text-xl font-bold text-white">Payment Time Improvement</h3><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={paymentTrend} onClick={(s) => { const payload = s?.activePayload?.[0]?.payload as (typeof paymentTrend)[number] | undefined; if (payload) setPaymentPoint(payload); }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" /><XAxis dataKey="day" tick={{ fill: "#cbd5e1", fontSize: 11 }} /><YAxis tick={{ fill: "#cbd5e1", fontSize: 11 }} /><Tooltip /><Area type="monotone" dataKey="manual" stroke="#f59e0b" fill="#f59e0b33" /><Area type="monotone" dataKey="digital" stroke="#22c55e" fill="#22c55e33" /></AreaChart></ResponsiveContainer></div><p className="mt-3 text-sm text-slate-300">Selected {paymentPoint.day}: digital saves <b>{paymentPoint.manual - paymentPoint.digital}h</b> vs manual.</p></Card>
  <Card className="p-6"><h3 className="text-xl font-bold text-white">Leakage Control Focus</h3><div className="mt-6 h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={riskData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={108} paddingAngle={4} onClick={(_, i)=>setActiveRisk(riskData[i])}>{riskData.map((entry, i) => <Cell key={entry.name} fill={colors[i % colors.length]} stroke={activeRisk.name===entry.name?"#fff":"transparent"} strokeWidth={2} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><p className="text-sm text-emerald-200">Selected risk: {activeRisk.name} ({activeRisk.value}%)</p></Card>
  </div></section></main>;
}
