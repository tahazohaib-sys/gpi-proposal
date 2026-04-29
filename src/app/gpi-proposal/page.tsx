"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock,
  CloudCog,
  Database,
  Fingerprint,
  Gauge,
  Languages,
  MapPinned,
  PackageCheck,
  PhoneCall,
  QrCode,
  Server,
  ShieldCheck,
  Smartphone,
  Sprout,
  TrendingDown,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  WalletCards,
  Wheat,
  WifiOff,
  X,
  ZoomIn,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const money = new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 });

const heroStats = [
  { label: "Farmer Profiles", value: 847320, suffix: "", decimals: 0, icon: Users, trend: "+12.4%" },
  { label: "Maunds Procured", value: 12.4, suffix: "M", decimals: 1, icon: Wheat, trend: "+8.2%" },
  { label: "PKR Disbursed", value: 48.7, suffix: "B", decimals: 1, icon: Banknote, trend: "+19.1%" },
  { label: "Avg Payment Time", value: 52, suffix: "h", decimals: 0, icon: Clock, trend: "-64%" },
  { label: "Bardana Accuracy", value: 99.2, suffix: "%", decimals: 1, icon: PackageCheck, trend: "+2.1%" },
  { label: "Fraud Flags", value: 1847, suffix: "", decimals: 0, icon: ShieldCheck, trend: "Real-time" },
  { label: "Active Centers", value: 92, suffix: "", decimals: 0, icon: Building2, trend: "Punjab-wide" },
  { label: "System Uptime", value: 99.7, suffix: "%", decimals: 1, icon: Activity, trend: "24/7 ops" },
];

const kpis = [
  { label: "Procurement Centers", value: "92", note: "Punjab-wide storage units", icon: Building2 },
  { label: "Pilot Districts", value: "8–10", note: "One live procurement cycle", icon: MapPinned },
  { label: "Payment Target", value: "48–72h", note: "After verified weighment", icon: WalletCards },
  { label: "Bardana Control", value: "99%+", note: "Serialized bag reconciliation", icon: PackageCheck },
];

const districtData = [
  { district: "Sahiwal",     farmers: 18420, procured: 82, payments: 76, bardana: 97, exceptions: 3 },
  { district: "Okara",       farmers: 21180, procured: 76, payments: 71, bardana: 96, exceptions: 5 },
  { district: "Vehari",      farmers: 16940, procured: 68, payments: 64, bardana: 94, exceptions: 7 },
  { district: "Khanewal",    farmers: 19875, procured: 71, payments: 67, bardana: 95, exceptions: 4 },
  { district: "Bahawalnagar",farmers: 23890, procured: 64, payments: 59, bardana: 93, exceptions: 9 },
  { district: "Pakpattan",   farmers: 14620, procured: 59, payments: 55, bardana: 92, exceptions: 6 },
];

const bardanaTrend = [
  { week: "Wk 1", issued: 124000, returned: 118000, pending: 6000 },
  { week: "Wk 2", issued: 186000, returned: 179200, pending: 6800 },
  { week: "Wk 3", issued: 241000, returned: 235000, pending: 6000 },
  { week: "Wk 4", issued: 287000, returned: 282100, pending: 4900 },
  { week: "Wk 5", issued: 312000, returned: 308200, pending: 3800 },
  { week: "Wk 6", issued: 298000, returned: 295400, pending: 2600 },
];

const farmerTimeline: Record<string, { step: string; date: string; time: string; status: "done" | "current" | "pending" | "upcoming"; officer: string }[]> = {
  "GPI-PB-00018472": [
    { step: "CNIC Verified (NADRA Verisys)", date: "03 Apr 2026", time: "09:14", status: "done", officer: "Muhammad Tariq (FO-OKR-12)" },
    { step: "Land Verified (PLRA API)",      date: "03 Apr 2026", time: "09:22", status: "done", officer: "Auto via PLRA API" },
    { step: "Intent to Sell Approved",       date: "04 Apr 2026", time: "11:05", status: "done", officer: "Procurement Officer" },
    { step: "Bardana Issued (790 bags)",      date: "05 Apr 2026", time: "08:30", status: "done", officer: "Center Desk" },
    { step: "Gate-in & Quality Check",       date: "12 Apr 2026", time: "07:45", status: "done", officer: "Quality Inspector" },
    { step: "Weighbridge Record",            date: "12 Apr 2026", time: "08:02", status: "done", officer: "Auto via Weighbridge API" },
    { step: "Payment Voucher Generated",     date: "12 Apr 2026", time: "10:30", status: "done", officer: "Finance Console (Auto)" },
    { step: "Paid via Raast",                date: "13 Apr 2026", time: "14:22", status: "done", officer: "Bank of Punjab" },
  ],
  "GPI-PB-00021984": [
    { step: "CNIC Verified (NADRA Verisys)", date: "05 Apr 2026", time: "10:33", status: "done",    officer: "Amna Javed (FO-VHR-07)" },
    { step: "Land Verified (PLRA API)",      date: "05 Apr 2026", time: "10:44", status: "done",    officer: "Auto via PLRA API" },
    { step: "Intent to Sell Approved",       date: "06 Apr 2026", time: "09:15", status: "done",    officer: "Procurement Officer" },
    { step: "Bardana Issued (436 bags)",      date: "07 Apr 2026", time: "08:00", status: "done",    officer: "Center Desk" },
    { step: "Gate-in & Quality Check",       date: "15 Apr 2026", time: "07:30", status: "done",    officer: "Quality Inspector" },
    { step: "Weighbridge Record",            date: "15 Apr 2026", time: "07:48", status: "done",    officer: "Auto via Weighbridge API" },
    { step: "Payment Voucher Generated",     date: "15 Apr 2026", time: "11:00", status: "done",    officer: "Finance Console (Auto)" },
    { step: "Finance Approval Pending",      date: "15 Apr 2026", time: "11:00", status: "pending", officer: "Awaiting Finance DG" },
  ],
  "GPI-PB-00023210": [
    { step: "CNIC Verified (NADRA Verisys)", date: "07 Apr 2026", time: "11:20", status: "done",     officer: "Saira Akhtar (FO-SWL-03)" },
    { step: "Land Verified (PLRA API)",      date: "07 Apr 2026", time: "11:35", status: "done",     officer: "Auto via PLRA API" },
    { step: "Intent to Sell Approved",       date: "08 Apr 2026", time: "10:00", status: "done",     officer: "Procurement Officer" },
    { step: "Bardana Issued (284 bags)",      date: "09 Apr 2026", time: "09:15", status: "done",     officer: "Center Desk" },
    { step: "Gate-in & Quality Check",       date: "17 Apr 2026", time: "08:10", status: "done",     officer: "Quality Inspector" },
    { step: "Weighbridge Record",            date: "17 Apr 2026", time: "08:28", status: "done",     officer: "Auto via Weighbridge API" },
    { step: "Payment Ready for Transfer",    date: "17 Apr 2026", time: "12:45", status: "current",  officer: "Awaiting transfer" },
    { step: "Raast Transfer",                date: "—",           time: "—",     status: "upcoming", officer: "Pending" },
  ],
};

const farmerCases = [
  {
    id: "GPI-PB-00018472",
    name: "Muhammad Akram",
    father: "Allah Ditta",
    district: "Okara",
    tehsil: "Depalpur",
    village: "Chak 38/D",
    cnic: "35202-****-123-7",
    mobile: "0300-***-2187",
    acres: 12.5,
    crop: "Wheat",
    khasra: "214/7, 215/2",
    khewat: "KHW-OKR-2847",
    patwari: "Malik Iftikhar (Zone B)",
    bank: "Bank of Punjab",
    iban: "PK36 BPUN **** 6721",
    request: "420 maunds",
    approved: "395 maunds",
    bardana: "790 bags",
    bardanaRange: "OKR-DPL-2026-008110 to 008899",
    weight: "386.4 maunds",
    moisture: "10.8%",
    foreignMatter: "1.1%",
    grade: "A-",
    godown: "Okara Center, Godown 03, Stack 12",
    lot: "OKR-WHT-2026-0441",
    payment: 1506960,
    status: "Paid via Raast",
    statusTone: "emerald",
    completedSteps: 8,
    totalSteps: 8,
  },
  {
    id: "GPI-PB-00021984",
    name: "Bashir Ahmad",
    father: "Ghulam Rasool",
    district: "Vehari",
    tehsil: "Mailsi",
    village: "Mauza Fatehpur",
    cnic: "36601-****-441-3",
    mobile: "0301-***-5529",
    acres: 7.0,
    crop: "Wheat",
    khasra: "91/3, 91/4",
    khewat: "KHW-VHR-1194",
    patwari: "Rashid Ahmad (Zone A)",
    bank: "JazzCash Wallet",
    iban: "PK91 JAZZ **** 1104",
    request: "250 maunds",
    approved: "218 maunds",
    bardana: "436 bags",
    bardanaRange: "VHR-MLS-2026-003220 to 003655",
    weight: "211.8 maunds",
    moisture: "11.4%",
    foreignMatter: "1.6%",
    grade: "B+",
    godown: "Vehari Center, Godown 01, Stack 07",
    lot: "VHR-WHT-2026-0218",
    payment: 825000,
    status: "Finance Approval",
    statusTone: "amber",
    completedSteps: 7,
    totalSteps: 8,
  },
  {
    id: "GPI-PB-00023210",
    name: "Safia Bibi",
    father: "Late Muhammad Din",
    district: "Sahiwal",
    tehsil: "Chichawatni",
    village: "Chak 110/12-L",
    cnic: "36502-****-904-2",
    mobile: "0345-***-8112",
    acres: 4.5,
    crop: "Wheat",
    khasra: "55/1",
    khewat: "KHW-SWL-0782",
    patwari: "Altaf Hussain (Zone C)",
    bank: "Easypaisa Wallet",
    iban: "PK44 EPAY **** 3019",
    request: "160 maunds",
    approved: "142 maunds",
    bardana: "284 bags",
    bardanaRange: "SWL-CHW-2026-001840 to 002123",
    weight: "139.6 maunds",
    moisture: "10.2%",
    foreignMatter: "0.9%",
    grade: "A",
    godown: "Chichawatni Center, Godown 02, Stack 04",
    lot: "SWL-WHT-2026-0139",
    payment: 544440,
    status: "Ready for Payment",
    statusTone: "sky",
    completedSteps: 6,
    totalSteps: 8,
  },
];

const workflowSteps = [
  {
    title: "Farmer Registration",
    icon: Fingerprint,
    app: "Farmer App / Field Officer Tablet",
    action: "CNIC, thumb verification, mobile OTP, village address, and PLRA land data are captured.",
    dummy: "Muhammad Akram registered with 12.5 verified acres in Depalpur, Okara.",
    controls: ["NADRA Verisys", "CNIC uniqueness check", "Mobile OTP", "PLRA acreage check", "Duplicate biometric alert", "GPS photo timestamp"],
    time: "~12 min", role: "Field Officer / Farmer Self-Service",
  },
  {
    title: "Intent to Sell",
    icon: Sprout,
    app: "Farmer App / USSD / Center Desk",
    action: "Farmer submits quantity request and preferred delivery window. System auto-calculates eligible quota using verified acres and district yield benchmark. Procurement Officer reviews and approves.",
    dummy: "Requested 420 maunds; approved 395 maunds based on 12.5 acres × 37 md/acre benchmark. Delivery slot: 12 April 2026.",
    controls: ["Quota cap enforcement", "Officer approval required", "District yield benchmark", "Delivery slot scheduler", "Audit trail entry", "SMS to farmer"],
    time: "~2 days", role: "Farmer + Procurement Officer",
  },
  {
    title: "Bardana Issuance",
    icon: PackageCheck,
    app: "Procurement Center Console",
    action: "Serialized, barcoded bags are issued to the farmer and digitally mapped to their Farmer ID. Farmer receives an SMS with serial range, issuance date, and return deadline.",
    dummy: "790 bags issued: OKR-DPL-2026-008110 to OKR-DPL-2026-008899. Return deadline: 15 April 2026.",
    controls: ["Barcode / RFID scan", "Issue ledger entry", "Return deadline tracking", "Leakage auto-alert", "Farmer SMS with serial range", "Unissued bag reconciliation"],
    time: "~30 min", role: "Center Desk Officer",
  },
  {
    title: "Gate + Quality + Weighment",
    icon: Truck,
    app: "Gate Kiosk + Quality App + Weighbridge API",
    action: "QR code scanned, bardana serials matched, quality parameters tested (moisture, foreign matter), photos captured, and weighbridge pushes weight directly with no manual override.",
    dummy: "Net weight 386.4 maunds, Grade A-, moisture 10.8%, foreign matter 1.1%. Weighbridge auto-sent. 4 photos captured with GPS timestamp.",
    controls: ["No manual weight entry", "Photo + GPS evidence", "Quality parameter thresholds", "Second approval above 300 md", "Bardana serial reconciliation", "Officer biometric at gate"],
    time: "~45 min", role: "Gate Officer + Quality Inspector",
  },
  {
    title: "Payment Approval",
    icon: WalletCards,
    app: "Finance Console",
    action: "Voucher auto-generated from weighbridge data × support price, adjusted for quality. Three-tier approval: Procurement Officer → Storage Manager → Finance DG. Bank title checked via 1Link.",
    dummy: "PKR 1,506,960 = 386.4 md × 3,900, A- grade. All 3 approvals done. 1Link title matched. Pushed to Raast on 13 April 2026.",
    controls: ["Maker-checker (3 tiers)", "1Link bank title match", "Voucher hash & timestamp", "Daily reconciliation", "Raast / EasyPay push", "Farmer SMS on credit"],
    time: "~36 hours", role: "Finance DG (final approver)",
  },
  {
    title: "Inventory & Storage",
    icon: Database,
    app: "Storage Manager Console",
    action: "Received batch allocated to godown, stack, and lot with full quality profile. FIFO-based release order. Fumigation schedule, moisture re-checks, and digital gate pass for any movement.",
    dummy: "Okara Center, Godown 03, Stack 12, Lot OKR-WHT-2026-0441. Fumigation scheduled 20 Apr. Next FIFO release 3 May.",
    controls: ["Stack-level ledger", "Variance & shrinkage alerts", "Digital gate pass only", "FIFO release enforcement", "Fumigation scheduler", "Moisture re-check log"],
    time: "Ongoing", role: "Storage Manager",
  },
];

const paymentTrend = [
  { day: "Day 1",  manual: 92, digital: 72 },
  { day: "Day 7",  manual: 88, digital: 58 },
  { day: "Day 14", manual: 81, digital: 45 },
  { day: "Day 21", manual: 78, digital: 39 },
  { day: "Day 30", manual: 74, digital: 33 },
  { day: "Day 45", manual: 71, digital: 28 },
  { day: "Day 60", manual: 68, digital: 24 },
];

const riskData = [
  { name: "Bardana Leakage", value: 31, mitigation: "Serialized bags + return scanning + auto leakage alerts within 48h" },
  { name: "Ghost Farmers",   value: 22, mitigation: "NADRA biometric + CNIC uniqueness check + PLRA acreage cross-validation" },
  { name: "Weighbridge",     value: 18, mitigation: "Direct API push, no manual entry, officer biometric required at gate" },
  { name: "Payment Fraud",   value: 16, mitigation: "1Link bank title match + maker-checker (3 tiers) + Raast audit trail" },
  { name: "Inventory Gaps",  value: 13, mitigation: "Stack-level ledger + FIFO enforcement + variance alert + digital gate pass" },
];

const exceptionRows = [
  {
    id: "EXC-2026-00412", severity: "high",
    type: "Bank title mismatch", district: "Bahawalnagar",
    case: "CNIC name 'Muhammad Yousuf' differs from JazzCash wallet title 'M. Yousef'.",
    action: "Payment blocked. Field officer dispatched for biometric re-verification.",
    raised: "29 Apr 2026, 10:14", raisedBy: "Payment Console (Auto)",
    assigned: "FO-BWN-08", farmerID: "GPI-PB-00041823", amount: 612000,
  },
  {
    id: "EXC-2026-00389", severity: "medium",
    type: "Excess quantity request", district: "Vehari",
    case: "Farmer requested 380 maunds but verified acreage only supports 290 maunds at district benchmark.",
    action: "Request capped at 290 maunds. Procurement Officer review logged. Farmer notified via SMS.",
    raised: "27 Apr 2026, 14:30", raisedBy: "Quota Engine (Auto)",
    assigned: "PO-VHR-03", farmerID: "GPI-PB-00038914", amount: 1131000,
  },
  {
    id: "EXC-2026-00401", severity: "medium",
    type: "Missing bardana return", district: "Okara",
    case: "26 of 436 issued bags not scanned at inbound gate. Serial range: OKR-DPL-2026-009102 to 009127.",
    action: "Auto-alert to center in-charge. 48-hour window for farmer to return bags or pay penalty.",
    raised: "28 Apr 2026, 09:55", raisedBy: "Bardana Reconciliation Engine",
    assigned: "CI-OKR-01", farmerID: "GPI-PB-00019882", amount: null,
  },
  {
    id: "EXC-2026-00418", severity: "high",
    type: "Weight anomaly", district: "Sahiwal",
    case: "Farmer has had 3 consecutive weighments averaging 18% above district mean. Possible collusion.",
    action: "Second officer countersignature required. DG-level alert raised. Internal audit initiated.",
    raised: "29 Apr 2026, 11:40", raisedBy: "Anomaly Detection Engine",
    assigned: "Audit Team", farmerID: "GPI-PB-00022917", amount: null,
  },
];

const localDesign = [
  { title: "Urdu + Punjabi first",     text: "Farmer app uses simple Urdu/Punjabi labels, voice prompts, and icon-led screens for low-literacy users.", icon: Languages, detail: "All farmer-facing screens use under 100 words. Core flows tested with farmers in under 10 minutes from launch to submission." },
  { title: "Assisted onboarding",      text: "Field Officers register farmers at village, union council, or center using biometric tablet and mobile OTP.", icon: UserCheck, detail: "Field Officers have an offline-capable app. Registration requires CNIC scan + thumb + OTP + GPS photo. Total time: ~12 minutes per farmer." },
  { title: "Feature phone support",    text: "SMS, IVR, and USSD provide request status, bardana slip, receipt, and payment confirmation.", icon: PhoneCall, detail: "Channels: outbound SMS, USSD short codes, automated IVR with Urdu voice. Farmers check status without a smartphone or data plan." },
  { title: "Offline center ops",       text: "Each procurement center keeps working during weak 4G using encrypted offline queues and edge sync.", icon: WifiOff, detail: "Center apps cache up to 72 hours of transactions in an encrypted SQLite queue. Sync happens automatically when connectivity resumes." },
  { title: "Local land language",      text: "Khasra, Khewat, Mauza, Tehsil, District, tenancy and Patwari verification are built into the form design.", icon: MapPinned, detail: "Forms mirror the Patwari girdawari structure. PLRA integration auto-fills Khasra, Khewat, and Mauza from CNIC lookup, reducing entry errors by ~80%." },
  { title: "Trust-building payments",  text: "Farmer sees voucher, approval stage, bank reference, and SMS confirmation instead of waiting blindly.", icon: Banknote, detail: "Farmer receives SMS at 4 key stages: intent approval, bardana issuance, weighment completion, and payment credit — each with a reference number." },
];

const techModules = [
  { module: "Farmer App",          tech: "React Native (Android-first)", icon: Smartphone,    desc: "Offline-capable, Urdu/Punjabi UI, biometric, USSD fallback.", category: "Mobile" },
  { module: "Field Officer Tablet",tech: "Android Tablet App",           icon: ClipboardCheck,desc: "Assisted registration, PLRA API sync, village onboarding.",     category: "Mobile" },
  { module: "Center Console",      tech: "Web App (PWA)",                icon: Building2,     desc: "Bardana, weighbridge, quality, gate ops, offline queue.",       category: "Web" },
  { module: "Finance Console",     tech: "Web App",                      icon: Banknote,      desc: "3-tier voucher approval, 1Link title check, Raast push.",      category: "Web" },
  { module: "Storage Console",     tech: "Web App",                      icon: Database,      desc: "Batch tracking, FIFO, fumigation schedule, digital gate pass.", category: "Web" },
  { module: "Command Dashboard",   tech: "Next.js + Recharts",           icon: BarChart3,     desc: "CEO/DG real-time view, district drill-down, exception queue.", category: "Analytics" },
  { module: "API Gateway",         tech: "Node.js + REST/gRPC",          icon: Server,        desc: "NADRA, PLRA, 1Link, Raast, EasyPay, JazzCash, Easypaisa.",    category: "Backend" },
  { module: "Audit & Compliance",  tech: "Immutable Event Log",          icon: ShieldCheck,   desc: "Every action hashed, GPS-timestamped, officer-attributed.",    category: "Security" },
];

const roadmap = [
  {
    phase: "01", title: "Discovery & Field Mapping", duration: "6–8 weeks",
    output: "Visit sample centers, map manual process, confirm PLRA/NADRA/bank integration, finalize KPIs.",
    milestones: ["Field visits to 5+ centers across pilot districts", "Stakeholder workshops with GPI leadership", "Manual process documentation + gap analysis", "PLRA/NADRA/1Link API readiness check", "KPI baseline from paper records", "Integration architecture blueprint"],
    team: "2 Business Analysts · 1 Solutions Architect · 1 Field Coordinator · 1 PM",
    deliverable: "Discovery Report + Integration Blueprint + Revised KPI Framework",
    risk: "PLRA/NADRA API access delays — mitigated by parallel mock integration setup during discovery.",
  },
  {
    phase: "02", title: "Prototype for CEO Approval", duration: "4–6 weeks",
    output: "Clickable farmer journey, center console, finance console, and executive dashboard demo.",
    milestones: ["Clickable Farmer App screens (Urdu)", "Center Console walkthrough", "Finance Console approval flow", "Executive dashboard with dummy live data", "CEO walkthrough session", "Feedback loop and sign-off"],
    team: "2 UX Designers · 2 Frontend Developers · 1 BA · 1 PM",
    deliverable: "Approved prototype + sign-off for full build commitment",
    risk: "Scope creep — contained by strict clickable-only boundary, no back-end during this phase.",
  },
  {
    phase: "03", title: "Core Build + Integrations", duration: "16–20 weeks",
    output: "Apps, APIs, database, audit log, bardana, weighment, payment, inventory, reporting.",
    milestones: ["Farmer App + Field Officer App (Android)", "Center, Finance, Storage consoles (Web)", "API Gateway: NADRA, PLRA, 1Link, Raast", "Weighbridge integration (top 10 models)", "Bardana serialization + reconciliation engine", "Audit log + immutable event store", "Command Dashboard v1", "QA + UAT + security audit"],
    team: "4 Backend · 3 Frontend · 2 Mobile · 1 DevOps · 1 QA Lead · 1 Security",
    deliverable: "Production-ready platform with all integrations live",
    risk: "Weighbridge hardware variance — solved by hardware-agnostic adapter layer.",
  },
  {
    phase: "04", title: "Pilot in 8–10 Districts", duration: "12–16 weeks",
    output: "Live procurement cycle, daily issue room, farmer helpdesk, center support, KPI report.",
    milestones: ["Hardware deployment at centers + tablets", "Center staff training (2-day sessions)", "Farmer onboarding via Field Officers", "Daily war room with GPI leadership", "Farmer helpdesk (call center + WhatsApp)", "Weekly KPI reports", "Iterative bug fixes + UX improvements"],
    team: "8–10 Field Coordinators · 2 Support Engineers · 1 Data Analyst · 6 Helpdesk Agents",
    deliverable: "Pilot KPI Report: payment speed, bardana accuracy, fraud flags, uptime",
    risk: "Low farmer adoption — mitigated by assisted onboarding via Field Officers at village level.",
  },
  {
    phase: "05", title: "Province Rollout", duration: "20–28 weeks",
    output: "All 92 centers, training, hardware deployment, helpdesk, command center, managed service.",
    milestones: ["Full hardware rollout (92 centers)", "Province-wide staff training", "Automated monitoring + alerting", "Punjab Command Center activation", "Managed service SLA (99.5% uptime)", "Expansion planning: rice, cotton, sugarcane"],
    team: "8 Field Coordinators · 4 Support Engineers · 12 Helpdesk Agents · 1 Account Manager",
    deliverable: "All-Punjab live platform + Managed Service Agreement",
    risk: "Political transitions — addressed by design-by-process, not-by-person, with full audit trail.",
  },
];

const colors = ["#22c55e", "#84cc16", "#38bdf8", "#f59e0b", "#a78bfa"];
const sevColors: Record<string, string> = { high: "rose", medium: "amber", low: "emerald" };

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionTitle({ eyebrow, title, subtitle, id }: { eyebrow: string; title: string; subtitle?: string; id?: string }) {
  return (
    <div id={id} className="mx-auto mb-10 max-w-4xl text-center scroll-mt-20">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-4 text-base leading-8 text-slate-300 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

function Card({ children, className = "", onClick, hover = false }: { children: React.ReactNode; className?: string; onClick?: () => void; hover?: boolean }) {
  return (
    <div
      onClick={onClick}
      className={cx(
        "rounded-[1.7rem] border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-xl",
        hover && "cursor-pointer transition-all duration-200 hover:border-emerald-300/30 hover:bg-white/[0.09]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatusPill({ tone, children }: { tone: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    emerald: "border-emerald-300/30 bg-emerald-300/15 text-emerald-100",
    amber:   "border-amber-300/30 bg-amber-300/15 text-amber-100",
    sky:     "border-sky-300/30 bg-sky-300/15 text-sky-100",
    rose:    "border-rose-300/30 bg-rose-300/15 text-rose-100",
    lime:    "border-lime-300/30 bg-lime-300/15 text-lime-100",
  };
  return <span className={cx("rounded-full border px-3 py-1 text-xs font-semibold", styles[tone] || styles.emerald)}>{children}</span>;
}

function AnimatedCounter({ end, decimals = 0 }: { end: number; decimals?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let step = 0;
    const steps = 50;
    const timer = setInterval(() => {
      step++;
      const eased = 1 - Math.pow(1 - step / steps, 3);
      setValue(end * eased);
      if (step >= steps) { setValue(end); clearInterval(timer); }
    }, 1400 / steps);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}</span>;
}

export default function GPIProposalApp() {
  const [activeStep, setActiveStep]           = useState(workflowSteps[0]);
  const [activeFarmer, setActiveFarmer]       = useState(farmerCases[0]);
  const [farmerModal, setFarmerModal]         = useState<typeof farmerCases[0] | null>(null);
  const [dashTab, setDashTab]                 = useState<"districts"|"payments"|"bardana"|"risk">("districts");
  const [selectedRisk, setSelectedRisk]       = useState<typeof riskData[0] | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<typeof districtData[0] | null>(null);
  const [expandedPhase, setExpandedPhase]     = useState<string | null>(null);
  const [expandedException, setExpandedException] = useState<typeof exceptionRows[0] | null>(null);
  const [expandedDesign, setExpandedDesign]   = useState<string | null>(null);
  const [activeSection, setActiveSection]     = useState("overview");

  const navSections = useMemo(() => [
    { id: "overview",   label: "Overview" },
    { id: "design",     label: "Field Design" },
    { id: "journey",    label: "Farmer Journey" },
    { id: "workflow",   label: "Workflow" },
    { id: "dashboard",  label: "Dashboard" },
    { id: "technology", label: "Technology" },
    { id: "roadmap",    label: "Roadmap" },
  ], []);

  useEffect(() => {
    const onScroll = () => {
      const closest = navSections
        .map((s) => ({ id: s.id, top: Math.abs((document.getElementById(s.id)?.getBoundingClientRect().top ?? Infinity) - 80) }))
        .reduce((a, b) => (a.top < b.top ? a : b));
      setActiveSection(closest.id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navSections]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const progress = useMemo(() => workflowSteps.findIndex((s) => s.title === activeStep.title) + 1, [activeStep]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#06140c] text-slate-100">

      {/* ── Background ── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute left-1/3 top-[-15%] h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-lime-300/8 blur-3xl" />
        <div className="absolute left-[-10%] top-[45%] h-[500px] w-[500px] rounded-full bg-sky-500/8 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* ── Header + Nav ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06140c]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300 text-emerald-950 shadow-lg shadow-emerald-500/30">
              <Wheat className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-300">RTC League × Green Pakistan Initiative</p>
              <p className="text-sm font-bold text-white">Digital Wheat Procurement</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {navSections.map((s) => (
              <button key={s.id} onClick={() => scrollTo(s.id)} className={cx("rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all", activeSection === s.id ? "bg-emerald-300/20 text-emerald-100" : "text-slate-400 hover:text-slate-200")}>
                {s.label}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs text-emerald-100 md:flex">
            <Gauge className="h-3.5 w-3.5" /> CEO Demo
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section id="overview" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24 scroll-mt-16">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
            <ShieldCheck className="h-4 w-4" /> Punjab-ready · Field-ready · Audit-ready
          </div>
          <h1 className="text-4xl font-black leading-[1.02] text-white md:text-[4.25rem]">
            One Digital System for{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-lime-300 bg-clip-text text-transparent">
              Wheat Procurement
            </span>{" "}
            Across Punjab.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A realistic, Pakistan-first platform connecting farmers, field officers, procurement centers, weighbridges, banks, storage units, and leadership dashboards into one trusted operating system.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {["NADRA + biometric verification", "PLRA land validation", "Serialized bardana tracking", "Raast / 1Link payments", "Offline center operations", "Urdu-first farmer app"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition hover:bg-white/[0.07]">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                <span className="text-sm text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <Card className="p-5">
            <div className="rounded-[1.35rem] border border-emerald-300/15 bg-[#071a0f] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Live Command Center</p>
                  <h3 className="text-xl font-black text-white">Punjab Procurement Snapshot</h3>
                  <p className="mt-1 text-xs text-emerald-100/60">Dummy data · CEO workflow demonstration</p>
                </div>
                <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-2">
                  <CloudCog className="h-6 w-6 text-emerald-300" />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {kpis.map((kpi) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={kpi.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-emerald-300/25 hover:bg-white/[0.07]">
                      <Icon className="mb-2 h-5 w-5 text-emerald-300" />
                      <p className="text-[11px] text-slate-400">{kpi.label}</p>
                      <p className="mt-1 text-2xl font-black text-white">{kpi.value}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{kpi.note}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* ── Metrics Banner ── */}
      <section className="border-y border-white/8 bg-white/[0.025] py-6">
        <div className="mx-auto max-w-7xl px-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {heroStats.map((stat) => {
              const Icon = stat.icon;
              const isNeg = stat.trend.startsWith("-");
              const isPos = stat.trend.startsWith("+");
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-center transition hover:border-emerald-300/20 hover:bg-white/[0.06]">
                  <Icon className="h-4 w-4 text-emerald-300" />
                  <p className="text-lg font-black text-white">
                    <AnimatedCounter end={stat.value} decimals={stat.decimals} />{stat.suffix}
                  </p>
                  <p className="text-[10px] text-slate-400">{stat.label}</p>
                  <span className={cx("text-[10px] font-semibold", isPos ? "text-emerald-300" : isNeg ? "text-rose-300" : "text-slate-500")}>{stat.trend}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Local Design ── */}
      <section id="design" className="mx-auto max-w-7xl px-5 py-14 pt-20 scroll-mt-16">
        <SectionTitle
          eyebrow="Local Demographic Fit"
          title="Designed for real Punjab field conditions."
          subtitle="The system does not assume every farmer has a smartphone, strong internet, or high literacy. Click any card to see how it works in practice."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {localDesign.map((item) => {
            const Icon = item.icon;
            const isOpen = expandedDesign === item.title;
            return (
              <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card hover className="h-full p-6" onClick={() => setExpandedDesign(isOpen ? null : item.title)}>
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-2.5">
                      <Icon className="h-6 w-6 text-emerald-300" />
                    </div>
                    <ChevronDown className={cx("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.text}</p>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-300/8 p-4">
                          <p className="text-sm leading-6 text-emerald-50">{item.detail}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionTitle
          eyebrow="Dummy Farmer Journey"
          title="How the workflow will actually work on ground."
          subtitle="Select a farmer record below. Click 'View Full Profile' to see the complete audit timeline, quality data, and storage allocation."
        />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            {farmerCases.map((farmer) => (
              <button key={farmer.id} onClick={() => setActiveFarmer(farmer)} className={cx("w-full rounded-3xl border p-4 text-left transition-all", activeFarmer.id === farmer.id ? "border-emerald-300/60 bg-emerald-300/15 shadow-lg shadow-emerald-900/20" : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]")}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{farmer.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{farmer.district} · {farmer.tehsil} · {farmer.village}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{farmer.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusPill tone={farmer.statusTone}>{farmer.status}</StatusPill>
                    <p className="text-[10px] text-slate-500">{farmer.completedSteps}/{farmer.totalSteps} steps done</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${(farmer.completedSteps / farmer.totalSteps) * 100}%` }} />
                </div>
              </button>
            ))}
          </div>

          <Card className="p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start">
              <div>
                <p className="text-sm text-emerald-200">{activeFarmer.id}</p>
                <h3 className="mt-1 text-2xl font-black text-white">{activeFarmer.name}</h3>
                <p className="mt-1 text-sm text-slate-400">S/O {activeFarmer.father} · {activeFarmer.cnic}</p>
                <p className="mt-0.5 text-xs text-slate-500">{activeFarmer.district} · {activeFarmer.tehsil} · {activeFarmer.village}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-center">
                <QrCode className="mx-auto h-9 w-9 text-emerald-300" />
                <p className="mt-1.5 text-[10px] text-slate-400">Farmer QR ID</p>
              </div>
            </div>
            <div className="mt-4 grid gap-2.5 md:grid-cols-2">
              {([
                ["Land Verified", `${activeFarmer.acres} acres`],
                ["Khasra", activeFarmer.khasra],
                ["Bank / Wallet", activeFarmer.bank],
                ["Approved Qty", activeFarmer.approved],
                ["Net Weight", activeFarmer.weight],
                ["Quality Grade", activeFarmer.grade],
                ["Moisture", activeFarmer.moisture],
                ["Foreign Matter", activeFarmer.foreignMatter],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                  <p className="text-[10px] text-slate-500">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <div>
                <p className="text-xs text-emerald-100/70">Calculated Payment</p>
                <p className="mt-0.5 text-3xl font-black text-white">PKR {money.format(activeFarmer.payment)}</p>
              </div>
              <StatusPill tone={activeFarmer.statusTone}>{activeFarmer.status}</StatusPill>
            </div>
            <button onClick={() => setFarmerModal(activeFarmer)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300/30 bg-emerald-300/15 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/25">
              <ZoomIn className="h-4 w-4" /> View Full Profile &amp; Audit Timeline
            </button>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionTitle
          eyebrow="Operational Workflow"
          title="Every action becomes a verified digital event."
          subtitle="Click each step to see the app module, officer action, dummy transaction, controls, time, and responsible role."
        />
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              const active = activeStep.title === step.title;
              return (
                <button key={step.title} onClick={() => setActiveStep(step)} className={cx("w-full rounded-3xl border p-4 text-left transition-all", active ? "border-emerald-300/60 bg-emerald-300/15 shadow-lg shadow-emerald-900/20" : "border-white/10 bg-white/[0.05] hover:bg-white/[0.08]")}>
                  <div className="flex items-center gap-4">
                    <div className={cx("flex h-11 w-11 items-center justify-center rounded-xl transition-all", active ? "bg-emerald-300 text-emerald-950" : "bg-white/10 text-emerald-200")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200">Step {String(idx + 1).padStart(2, "0")}</p>
                      <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      {active && <p className="mt-0.5 text-[10px] text-slate-400">{step.time} · {step.role}</p>}
                    </div>
                    <ChevronRight className={cx("h-4 w-4 transition-transform", active ? "rotate-90 text-emerald-300" : "text-slate-500")} />
                  </div>
                </button>
              );
            })}
          </div>

          <Card className="p-7">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">{progress}/6</div>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${(progress / 6) * 100}%` }} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={activeStep.title} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.22 }}>
                <h3 className="text-2xl font-black text-white">{activeStep.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1 text-[11px] font-semibold text-sky-200">{activeStep.app}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">{activeStep.time}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-300">{activeStep.role}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{activeStep.action}</p>
                <div className="mt-5 rounded-2xl border border-sky-300/20 bg-sky-300/8 p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-sky-300">Dummy transaction</p>
                  <p className="mt-2 text-sm leading-6 text-sky-50">{activeStep.dummy}</p>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {activeStep.controls.map((control) => (
                    <div key={control} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-300" />
                      <span className="text-xs text-slate-200">{control}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <SectionTitle
          eyebrow="CEO Dashboard"
          title="Live management view for decisions."
          subtitle="Use tabs to explore district progress, payment speed, bardana tracking, and risk breakdown. Click chart elements for details."
        />

        {/* Tab bar */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["districts", "payments", "bardana", "risk"] as const).map((tab) => (
            <button key={tab} onClick={() => setDashTab(tab)} className={cx("rounded-full border px-4 py-2 text-sm font-semibold transition-all", dashTab === tab ? "border-emerald-300/40 bg-emerald-300/20 text-emerald-100" : "border-white/10 bg-white/5 text-slate-400 hover:text-slate-200")}>
              {tab === "districts" && "District Progress"}
              {tab === "payments"  && "Payment Speed"}
              {tab === "bardana"   && "Bardana Tracking"}
              {tab === "risk"      && "Risk & Leakage"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Districts tab ── */}
          {dashTab === "districts" && (
            <motion.div key="districts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white">District Procurement Progress</h3>
                <p className="mt-1 text-xs text-slate-400">Click a bar to see district detail. Procured % · Payments % · Bardana %.</p>
                <div className="mt-5 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <BarChart data={districtData} onClick={(d: any) => { const name = d?.activePayload?.[0]?.payload?.district; if (name) setSelectedDistrict(districtData.find((x) => x.district === name) ?? null); }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="district" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: "#082012", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="procured" name="Procured %"  radius={[6,6,0,0]} fill="#34d399" cursor="pointer" />
                      <Bar dataKey="payments" name="Payments %"  radius={[6,6,0,0]} fill="#38bdf8" cursor="pointer" />
                      <Bar dataKey="bardana"  name="Bardana %"   radius={[6,6,0,0]} fill="#a78bfa" cursor="pointer" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white">Farmer Count by District</h3>
                <p className="mt-1 text-xs text-slate-400">{selectedDistrict ? `Showing: ${selectedDistrict.district}` : "Click a district above or a row below"}</p>
                <div className="mt-4 space-y-2.5">
                  {districtData.map((d) => (
                    <button key={d.district} onClick={() => setSelectedDistrict(d)} className={cx("w-full rounded-xl border p-3 text-left transition-all", selectedDistrict?.district === d.district ? "border-emerald-300/40 bg-emerald-300/10" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]")}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{d.district}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-slate-400">{d.farmers.toLocaleString()} farmers</p>
                          <StatusPill tone={d.exceptions > 7 ? "rose" : d.exceptions > 4 ? "amber" : "emerald"}>{d.exceptions} flags</StatusPill>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {[["Procured", d.procured, "bg-emerald-400"],["Payments", d.payments, "bg-sky-400"],["Bardana", d.bardana, "bg-violet-400"]].map(([lbl, pct, cls]) => (
                          <div key={String(lbl)} className="flex-1">
                            <p className="text-[9px] text-slate-500">{lbl}</p>
                            <div className="mt-1 h-1.5 rounded-full bg-white/10"><div className={cx("h-full rounded-full", String(cls))} style={{ width: `${pct}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* ── Payments tab ── */}
          {dashTab === "payments" && (
            <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white">Payment Time: Manual vs Digital</h3>
                <p className="mt-1 text-xs text-slate-400">Average hours from weighment to bank confirmation. Target: under 48 hours.</p>
                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={paymentTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} unit="h" />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Tooltip contentStyle={{ background: "#082012", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 12 }} formatter={(v: any) => [`${v}h`, ""]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="manual"  name="Manual Process" stroke="#f59e0b" fill="#f59e0b22" strokeWidth={2} />
                      <Area type="monotone" dataKey="digital" name="Digital System"  stroke="#22c55e" fill="#22c55e22" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <div className="space-y-4">
                {[
                  { label: "Manual baseline",   value: "92h",    sub: "At start of season",       Icon: TrendingDown },
                  { label: "Digital target",    value: "48–72h", sub: "Post-pilot KPI",           Icon: TrendingUp },
                  { label: "Improvement",       value: "~48%",   sub: "Reduction in wait time",   Icon: Activity },
                  { label: "Raast success rate",value: "99.1%",  sub: "Transaction success",      Icon: CheckCircle2 },
                ].map(({ label, value, sub, Icon }) => (
                  <Card key={label} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg border border-emerald-300/15 bg-emerald-300/8 p-2"><Icon className="h-5 w-5 text-emerald-300" /></div>
                      <div>
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="text-xl font-black text-white">{value}</p>
                        <p className="text-[10px] text-slate-500">{sub}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Bardana tab ── */}
          {dashTab === "bardana" && (
            <motion.div key="bardana" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white">Bardana Bag Tracking</h3>
                <p className="mt-1 text-xs text-slate-400">Weekly issued vs returned vs pending reconciliation. Target: &lt;1% unresolved.</p>
                <div className="mt-5 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bardanaTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="week" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <Tooltip contentStyle={{ background: "#082012", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 12 }} formatter={(v: any) => [(v as number).toLocaleString(), ""]} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Area type="monotone" dataKey="issued"   name="Issued"   stroke="#38bdf8" fill="#38bdf822" strokeWidth={2} />
                      <Area type="monotone" dataKey="returned" name="Returned" stroke="#22c55e" fill="#22c55e22" strokeWidth={2} />
                      <Area type="monotone" dataKey="pending"  name="Pending"  stroke="#f59e0b" fill="#f59e0b22" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <div className="space-y-4">
                {[
                  { label: "Total Bags Issued",        value: "1.45M", sub: "Across 6 weeks" },
                  { label: "Return Rate",               value: "98.1%", sub: "Serialized + scanned" },
                  { label: "Pending Reconciliation",    value: "2,600", sub: "Week 6, within 48h window" },
                  { label: "Lost / Unaccounted",        value: "0.08%", sub: "Below 1% KPI threshold" },
                ].map((m) => (
                  <Card key={m.label} className="p-4">
                    <p className="text-xs text-slate-400">{m.label}</p>
                    <p className="text-2xl font-black text-white">{m.value}</p>
                    <p className="text-[10px] text-slate-500">{m.sub}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Risk tab ── */}
          {dashTab === "risk" && (
            <motion.div key="risk" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white">Leakage Risk Breakdown</h3>
                <p className="mt-1 text-xs text-slate-400">Click a slice to see the mitigation strategy.</p>
                <div className="mt-4 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <PieChart onClick={(d: any) => { const name = d?.activePayload?.[0]?.payload?.name; if (name) setSelectedRisk(riskData.find((r) => r.name === name) ?? null); }}>
                      <Pie data={riskData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={100} paddingAngle={4} cursor="pointer">
                        {riskData.map((entry, i) => <Cell key={entry.name} fill={colors[i % colors.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#082012", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {selectedRisk && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/8 p-4">
                    <p className="text-sm font-bold text-white">{selectedRisk.name} — {selectedRisk.value}% of risk area</p>
                    <p className="mt-1 text-xs text-emerald-100">{selectedRisk.mitigation}</p>
                  </motion.div>
                )}
              </Card>
              <Card className="p-6">
                <h3 className="text-lg font-bold text-white">Exception Queue</h3>
                <p className="mt-1 text-xs text-slate-400">Click any row to expand full case detail.</p>
                <div className="mt-4 space-y-2">
                  {exceptionRows.map((row) => {
                    const isOpen = expandedException?.id === row.id;
                    const sev = sevColors[row.severity] ?? "amber";
                    return (
                      <div key={row.id}>
                        <button onClick={() => setExpandedException(isOpen ? null : row)} className={cx("w-full rounded-xl border p-3 text-left transition-all", isOpen ? "border-amber-300/30 bg-amber-300/8" : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]")}>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={cx("h-4 w-4 shrink-0", sev === "rose" ? "text-rose-400" : sev === "amber" ? "text-amber-400" : "text-emerald-400")} />
                            <p className="flex-1 text-xs font-bold text-white">{row.type}</p>
                            <StatusPill tone={sev}>{row.severity}</StatusPill>
                            <ChevronDown className={cx("h-3.5 w-3.5 text-slate-500 transition-transform", isOpen && "rotate-180")} />
                          </div>
                          <p className="mt-1 text-[11px] text-slate-400">{row.district} · {row.id}</p>
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <div className="space-y-1.5 rounded-b-xl border border-t-0 border-amber-300/20 bg-[#0d1a0f] px-4 pb-4 pt-3 text-xs">
                                <p className="text-slate-300"><span className="font-bold text-slate-100">Case:</span> {row.case}</p>
                                <p className="text-slate-300"><span className="font-bold text-slate-100">Action:</span> {row.action}</p>
                                <p className="text-slate-400"><span className="font-bold text-slate-300">Raised:</span> {row.raised} by {row.raisedBy}</p>
                                <p className="text-slate-400"><span className="font-bold text-slate-300">Assigned:</span> {row.assigned} · Farmer: {row.farmerID}</p>
                                {row.amount && <p className="text-slate-400"><span className="font-bold text-slate-300">Amount at risk:</span> PKR {money.format(row.amount)}</p>}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </section>

      {/* ── Technology Stack ── */}
      <section id="technology" className="mx-auto max-w-7xl px-5 py-14 scroll-mt-16">
        <SectionTitle
          eyebrow="System Architecture"
          title="Eight integrated modules, one unified platform."
          subtitle="Each module is purpose-built for its user: farmer, field officer, center staff, finance team, storage manager, or leadership."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {techModules.map((mod) => {
            const Icon = mod.icon;
            const catColor: Record<string, string> = { Mobile: "sky", Web: "emerald", Analytics: "lime", Backend: "violet", Security: "rose" };
            return (
              <motion.div key={mod.module} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <Card hover className="h-full p-5">
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
                      <Icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <StatusPill tone={catColor[mod.category] ?? "emerald"}>{mod.category}</StatusPill>
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-white">{mod.module}</h3>
                  <p className="mt-1 text-[11px] font-semibold text-emerald-300">{mod.tech}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{mod.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Third-Party Integrations</p>
          <div className="flex flex-wrap gap-2.5">
            {["NADRA Verisys", "PLRA API", "1Link Bank Title Check", "Raast (SBP)", "EasyPay", "JazzCash", "Easypaisa", "PITB Data", "Weighbridge API", "SMS Gateway", "IVR System", "Android MDM"].map((intg) => (
              <div key={intg} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-emerald-300/25 hover:text-emerald-100 cursor-default">
                {intg}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="mx-auto max-w-7xl px-5 py-14 scroll-mt-16">
        <SectionTitle
          eyebrow="Implementation Plan"
          title="A practical rollout GPI can approve and monitor."
          subtitle="Click each phase to expand milestones, team composition, deliverable, and key risk mitigation."
        />
        <div className="space-y-3">
          {roadmap.map((item) => {
            const isOpen = expandedPhase === item.phase;
            return (
              <Card key={item.phase} hover className="overflow-hidden">
                <button onClick={() => setExpandedPhase(isOpen ? null : item.phase)} className="w-full p-6 text-left">
                  <div className="grid gap-5 md:grid-cols-[80px_1fr_160px] md:items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300 text-xl font-black text-emerald-950 shadow-lg shadow-emerald-500/20">{item.phase}</div>
                    <div>
                      <h3 className="text-xl font-black text-white">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-300">{item.output}</p>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end md:gap-2">
                      <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100">{item.duration}</div>
                      <ChevronDown className={cx("h-5 w-5 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
                    </div>
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="border-t border-white/10 px-6 pb-6 pt-4">
                        <div className="grid gap-6 md:grid-cols-3">
                          <div>
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-300">Milestones</p>
                            <ul className="space-y-2">
                              {item.milestones.map((m) => (
                                <li key={m} className="flex items-start gap-2">
                                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                                  <span className="text-xs text-slate-300">{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-sky-300">Team</p>
                            <p className="text-xs leading-5 text-slate-300">{item.team}</p>
                            <p className="mb-1 mt-4 text-xs font-bold uppercase tracking-wider text-lime-300">Deliverable</p>
                            <p className="text-xs leading-5 text-slate-300">{item.deliverable}</p>
                          </div>
                          <div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">Key Risk &amp; Mitigation</p>
                            <div className="rounded-xl border border-amber-300/20 bg-amber-300/8 p-3">
                              <p className="text-xs leading-5 text-amber-100">{item.risk}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 pb-24">
        <div className="rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-400/20 via-white/[0.06] to-lime-400/10 p-8 md:p-12">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Decision Ask</p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">Approve a prototype-led pilot for Punjab wheat procurement.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-200">
                RTC League proposes to become the long-term technology partner for GPI: platform, integrations, rural communications, dashboards, training, helpdesk, and managed operations.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full border border-emerald-300/30 bg-emerald-300/15 px-4 py-2 text-sm font-semibold text-emerald-100">Phase 1 in 30 days</div>
                <div className="rounded-full border border-sky-300/30 bg-sky-300/15 px-4 py-2 text-sm font-semibold text-sky-100">CEO prototype before full build</div>
                <div className="rounded-full border border-lime-300/30 bg-lime-300/15 px-4 py-2 text-sm font-semibold text-lime-100">8–10 district pilot</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Commitments</p>
              {[
                "Start Phase 1 discovery within 30 days",
                "Deliver CEO prototype before full build commitment",
                "Pilot 8–10 districts in one procurement cycle",
                "Measure payment speed, bardana reconciliation, fraud flags, uptime",
                "Expand to rice, cotton, sugarcane, and other provinces after proof point",
              ].map((point) => (
                <div key={point} className="flex gap-3 border-b border-white/8 py-3 last:border-0">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                  <p className="text-sm text-slate-200">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Farmer Full-Profile Modal ── */}
      <AnimatePresence>
        {farmerModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setFarmerModal(null)}>
            <motion.div initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 24 }} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/15 bg-[#071a0f] p-7 shadow-2xl">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-300">{farmerModal.id}</p>
                  <h2 className="mt-1 text-2xl font-black text-white">{farmerModal.name}</h2>
                  <p className="text-sm text-slate-400">S/O {farmerModal.father} · CNIC {farmerModal.cnic}</p>
                </div>
                <button onClick={() => setFarmerModal(null)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Location &amp; Land</p>
                  {([["District", farmerModal.district],["Tehsil", farmerModal.tehsil],["Village / Mauza", farmerModal.village],["Khasra", farmerModal.khasra],["Khewat", farmerModal.khewat],["Patwari", farmerModal.patwari],["Verified Acres", `${farmerModal.acres} acres`]] as [string,string][]).map(([l,v]) => (
                    <div key={l} className="flex justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs">
                      <span className="text-slate-400">{l}</span><span className="font-semibold text-white">{v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Procurement Detail</p>
                  {([["Approved Qty", farmerModal.approved],["Bardana Issued", farmerModal.bardana],["Bardana Range", farmerModal.bardanaRange],["Net Weight", farmerModal.weight],["Moisture", farmerModal.moisture],["Foreign Matter", farmerModal.foreignMatter],["Quality Grade", farmerModal.grade],["Storage Lot", farmerModal.lot],["Godown", farmerModal.godown]] as [string,string][]).map(([l,v]) => (
                    <div key={l} className="flex justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs">
                      <span className="text-slate-400">{l}</span><span className="font-semibold text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-300/20 bg-emerald-300/8 p-4">
                <div>
                  <p className="text-xs text-emerald-100/70">Payment Amount</p>
                  <p className="mt-0.5 text-3xl font-black text-white">PKR {money.format(farmerModal.payment)}</p>
                  <p className="mt-1 text-xs text-slate-400">{farmerModal.bank} · {farmerModal.iban}</p>
                </div>
                <StatusPill tone={farmerModal.statusTone}>{farmerModal.status}</StatusPill>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Audit Timeline</p>
                <div className="space-y-2">
                  {(farmerTimeline[farmerModal.id] ?? []).map((event, i) => (
                    <div key={i} className={cx("flex items-start gap-3 rounded-xl border px-4 py-3 text-xs",
                      event.status === "done"     && "border-emerald-300/15 bg-emerald-300/8",
                      event.status === "current"  && "border-sky-300/20 bg-sky-300/8",
                      event.status === "pending"  && "border-amber-300/15 bg-amber-300/8",
                      event.status === "upcoming" && "border-white/8 bg-white/[0.03]",
                    )}>
                      <div className={cx("mt-0.5 h-2.5 w-2.5 rounded-full shrink-0",
                        event.status === "done"     && "bg-emerald-400",
                        event.status === "current"  && "bg-sky-400",
                        event.status === "pending"  && "bg-amber-400",
                        event.status === "upcoming" && "bg-slate-600",
                      )} />
                      <div className="flex-1">
                        <p className="font-semibold text-white">{event.step}</p>
                        <p className="text-slate-400">{event.date}{event.time !== "—" && ` · ${event.time}`} · {event.officer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
