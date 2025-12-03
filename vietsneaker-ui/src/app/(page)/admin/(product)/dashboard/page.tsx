"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  AdminOrderControllerService,
  FinancialReportControllerService,
  OrderDTO,
} from "@/gen";
import { logger } from "@/util/logger";
import { UNIT } from "@/config/app-config";
import AdminMainCard from "@/app/components/card/admin-card";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const EMPTY_CHART_VALUE = Array(12).fill(0);

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-300 flex items-center p-4 gap-4 rounded-none shadow-none">
    <div className="flex items-center justify-center">
      <img src={icon} alt={title} className="w-10 h-10 object-contain" />
    </div>
    <div>
      <div className="text-gray-700 text-lg font-medium">{title}</div>
      <div className="text-black text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const SalesChart: React.FC<{ year: number }> = ({ year }) => {
  const chartRef = useRef<Chart | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartData, setChartData] = useState<{ revenue: number[]; profit: number[] } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const revenueData = await FinancialReportControllerService.geFinancialReport(year);
        const profitData = await AdminOrderControllerService.getMonthlyRevenueInYear(year);
        const formattedRevenue = revenueData.map((v: number) => v / UNIT);
        const formattedProfit = profitData.map((v: number) => v / UNIT);
        setChartData({
          revenue: formattedRevenue.length === 12 ? formattedRevenue : EMPTY_CHART_VALUE,
          profit: formattedProfit.length === 12 ? formattedProfit : EMPTY_CHART_VALUE,
        });
      } catch (error) {
        logger.error("Error fetching data:", error);
        setChartData({ revenue: EMPTY_CHART_VALUE, profit: EMPTY_CHART_VALUE });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  useEffect(() => {
    if (canvasRef.current && chartData) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        if (chartRef.current) chartRef.current.destroy();
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`),
            datasets: [
              {
                label: "Doanh thu",
                data: chartData.revenue,
                backgroundColor: "#e20000", // 🔴 đỏ VietSneaker
              },
              {
                label: "Lợi nhuận",
                data: chartData.profit,
                backgroundColor: "#4b4b4b", // ⚫ xám đậm phẳng
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: "Triệu VNĐ" },
              },
              x: {
                title: { display: true, text: "Tháng" },
              },
            },
            plugins: { legend: { display: true, position: "top" } },
          },
        });
      }
    }
    return () => chartRef.current?.destroy();
  }, [chartData]);

  if (loading) return <div className="text-center text-gray-500 italic">Đang tải dữ liệu...</div>;
  return <canvas ref={canvasRef} className="w-full h-64" />;
};

const AdminDashboardPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<OrderDTO>({} as OrderDTO);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1];

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const resp = await AdminOrderControllerService.getYearlyOrder(selectedYear);
        setStats(resp);
      } catch (error) {
        logger.error(error);
      }
      setStatsLoading(false);
    };
    fetchStats();
  }, [selectedYear]);

  return (
    <AdminMainCard title="THỐNG KÊ" goBack={false}>
      {/* Thống kê nhanh */}
      <div className="grid grid-cols-3 gap-6 mb-4">
        <StatCard title="Tổng đơn" value={String(stats.totalOrders || "??")} icon="/total.png" />
        <StatCard title="Đã giao hoàn thành" value={String(stats.finishOrders || "??")} icon="/finish.png" />
        <StatCard title="Đơn ở trạng thái khác" value={String(stats.otherOrders || "??")} icon="/cancel.png" />
      </div>

      {/* Biểu đồ */}
      <div className="bg-white border border-gray-300 rounded-none shadow-none p-4 relative">
        <div className="flex justify-end mb-4 relative">
          <div
            className="flex items-center border border-gray-400 px-3 py-1 cursor-pointer select-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="mr-2">{selectedYear}</span>
            <span className="text-[#e20000] text-xs">▼</span>
          </div>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-300 z-10">
              {years.map((year) => (
                <div
                  key={year}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedYear(year);
                    setIsDropdownOpen(false);
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>
        <SalesChart year={selectedYear} />
      </div>
    </AdminMainCard>
  );
};

export default AdminDashboardPage;
