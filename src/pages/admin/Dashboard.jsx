import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import {
  BookOpen,
  FolderKanban,
  GraduationCap,
  Award,
  FileText,
  ScrollText,
  TrendingUp,
  Calendar,
  IndianRupee,
  Activity,
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [pubByYear, setPubByYear] = useState([]);
  const [funding, setFunding] = useState([]);
  const [patentStatus, setPatentStatus] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryRes = await api.get("/dashboard/summary");
        const pubRes = await api.get("/dashboard/publications-by-year");
        const fundingRes = await api.get("/dashboard/funding-by-agency");
        const patentRes = await api.get("/dashboard/patents-by-status");

        setSummary(summaryRes.data);
        setPubByYear(pubRes.data);
        setFunding(fundingRes.data);
        setPatentStatus(patentRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Publications",
      value: summary.total_publications,
      icon: <BookOpen size={22} />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-100",
      iconBg: "bg-blue-100",
    },
    {
      title: "Projects",
      value: summary.total_projects,
      icon: <FolderKanban size={22} />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-100",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Books",
      value: summary.total_books,
      icon: <ScrollText size={22} />,
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-100",
      iconBg: "bg-amber-100",
    },
    {
      title: "PhD Students",
      value: summary.total_phd_students,
      icon: <GraduationCap size={22} />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      borderColor: "border-purple-100",
      iconBg: "bg-purple-100",
    },
    {
      title: "Patents",
      value: summary.total_patents,
      icon: <FileText size={22} />,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-100",
      iconBg: "bg-rose-100",
    },
    {
      title: "Awards",
      value: summary.total_awards,
      icon: <Award size={22} />,
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      borderColor: "border-pink-100",
      iconBg: "bg-pink-100",
    },
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label, valuePrefix = "" }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-600">
            {valuePrefix}
            {payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <TrendingUp className="text-indigo-600" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Research Analytics Dashboard</h1>
                <p className="text-sm text-slate-500 mt-0.5">Comprehensive overview of research activities</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 mb-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl border ${card.borderColor} p-5 hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${card.iconBg} rounded-lg`}>
                  <span className={card.textColor}>{card.icon}</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">{card.value}</span>
              </div>
              <p className="text-sm font-medium text-slate-600">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Publications Trend */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="text-blue-600" size={18} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Publications Trend</h2>
            </div>

            {pubByYear.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <BookOpen className="text-slate-400 mb-2" size={32} />
                <p className="text-slate-500 text-sm">No publication data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={pubByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="publicationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#publicationGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Funding by Agency */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <IndianRupee className="text-emerald-600" size={18} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Funding Distribution</h2>
            </div>

            {funding.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <IndianRupee className="text-slate-400 mb-2" size={32} />
                <p className="text-slate-500 text-sm">No funding data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={funding}
                    dataKey="total_amount"
                    nameKey="funding_agency"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, percent }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {funding.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`₹ ${value.toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '13px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Patent Status Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 xl:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-rose-50 rounded-lg">
                <Activity className="text-rose-600" size={18} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800">Patent Status Overview</h2>
            </div>

            {patentStatus.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <FileText className="text-slate-400 mb-2" size={32} />
                <p className="text-slate-500 text-sm">No patent data available</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={patentStatus} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="status" 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="count" 
                    fill="#f43f5e"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  >
                    {patentStatus.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={index === 0 ? '#3fe8f4' : index === 1 ? '#f91616' : '#10b981'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}