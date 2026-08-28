'use client';

import React, { useMemo } from 'react';
import { Assessment, TrackingPeriod, EnvironmentalLog } from '../lib/types';
import { CloudSun, Info } from 'lucide-react';

interface ScalpTimelineChartProps {
  assessments: Assessment[];
  trackingPeriods: TrackingPeriod[];
  environmentalLogs?: EnvironmentalLog[];
  height?: number;
}

export function ScalpTimelineChart({
  assessments,
  trackingPeriods,
  environmentalLogs = [],
  height = 220,
}: ScalpTimelineChartProps) {
  // Sort assessments chronologically
  const sortedData = useMemo(() => {
    return [...assessments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [assessments]);

  // Identify product switch dates
  const productSwitchEvents = useMemo(() => {
    const events: { date: string; productName: string; index: number }[] = [];
    trackingPeriods.forEach((period) => {
      // Find matching assessment index for start date
      const idx = sortedData.findIndex((a) => a.date >= period.startDate);
      if (idx >= 0) {
        events.push({
          date: period.startDate,
          productName: period.productName,
          index: idx,
        });
      }
    });
    return events;
  }, [sortedData, trackingPeriods]);

  if (sortedData.length === 0) {
    return (
      <div className="bg-white border border-[#E5E2D8] rounded-2xl p-6 text-center text-[#5F5E5A]">
        <p className="text-sm font-medium">No scalp tracking data recorded yet.</p>
        <p className="text-xs text-[#8A8A82] mt-1">Complete your baseline assessment to view the scalp timeline.</p>
      </div>
    );
  }

  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartWidth = 500;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;

  const maxScore = 30; // Max symptom score scale

  // Compute SVG Points for symptom total score
  const points = sortedData.map((item, idx) => {
    const x =
      sortedData.length === 1
        ? paddingLeft + innerWidth / 2
        : paddingLeft + (idx / (sortedData.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - (item.totalScore / maxScore) * innerHeight;
    return { x, y, score: item.totalScore, date: item.date, week: item.weekNumber };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Weather humidity overlay polygon path
  const humidityPoints = sortedData.map((item, idx) => {
    const env = environmentalLogs.find((e) => e.date === item.date) || { humidity: 75 };
    const x =
      sortedData.length === 1
        ? paddingLeft + innerWidth / 2
        : paddingLeft + (idx / (sortedData.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - (env.humidity / 100) * (innerHeight * 0.4);
    return { x, y, humidity: env.humidity };
  });

  const humidityAreaD =
    points.length > 0
      ? `M ${points[0].x} ${paddingTop + innerHeight} ` +
        humidityPoints.map((pt) => `L ${pt.x} ${pt.y}`).join(' ') +
        ` L ${points[points.length - 1].x} ${paddingTop + innerHeight} Z`
      : '';

  return (
    <div className="bg-white border border-[#E5E2D8] rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-[#E5E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base text-[#1F3D2B]">Continuous Scalp Timeline</h3>
            <span className="bg-[#EAF0E7] text-[#3B6D11] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              All Products
            </span>
          </div>
          <p className="text-xs text-[#8A8A82]">
            Symptom score trajectory across all tracking periods with product switches
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#1F3D2B] rounded-full"></span>
            <span className="text-[#5F5E5A] font-medium">Symptom Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-amber-100/70 border border-amber-300 rounded-xs"></span>
            <span className="text-[#5F5E5A] font-medium">Humidity %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#D4AF6A] border-dashed border-t border-[#D4AF6A]"></span>
            <span className="text-[#5F5E5A] font-medium">Product Switch</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${height}`}
          className="w-full h-auto min-w-[320px]"
          style={{ overflow: 'visible' }}
        >
          {/* Background Grid Lines */}
          {[0, 10, 20, 30].map((val) => {
            const y = paddingTop + innerHeight - (val / maxScore) * innerHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  stroke="#F1EFE8"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  fill="#8A8A82"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Humidity Soft Overlay */}
          {humidityAreaD && (
            <path
              d={humidityAreaD}
              fill="rgba(212, 175, 106, 0.15)"
              stroke="rgba(212, 175, 106, 0.4)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}

          {/* Product Switch Vertical Markers */}
          {productSwitchEvents.map((evt, i) => {
            const pt = points[evt.index] || points[0];
            if (!pt) return null;
            return (
              <g key={i}>
                <line
                  x1={pt.x}
                  y1={paddingTop}
                  x2={pt.x}
                  y2={paddingTop + innerHeight}
                  stroke="#D4AF6A"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <circle cx={pt.x} cy={paddingTop} r="3" fill="#D4AF6A" />
                <text
                  x={pt.x}
                  y={paddingTop - 6}
                  fill="#1F3D2B"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Switch: {evt.productName.substring(0, 14)}...
                </text>
              </g>
            );
          })}

          {/* Line Chart Path */}
          {points.length > 1 && (
            <path
              d={pathD}
              fill="none"
              stroke="#1F3D2B"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#FAF9F5"
                stroke="#1F3D2B"
                strokeWidth="2"
              />
              <text
                x={pt.x}
                y={pt.y - 8}
                fill="#1F3D2B"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
              >
                {pt.score}
              </text>
              <text
                x={pt.x}
                y={paddingTop + innerHeight + 16}
                fill="#5F5E5A"
                fontSize="9"
                textAnchor="middle"
              >
                {pt.week === 0 ? 'Base' : `W${pt.week}`}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Environmental Context Soft Overlay Label */}
      <div className="mt-3 bg-[#FAF9F5] border border-[#E5E2D8] rounded-xl p-2.5 flex items-start gap-2 text-xs text-[#5F5E5A]">
        <CloudSun size={16} className="text-[#D4AF6A] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#1F3D2B]">Contextual Variable Overlay:</span> Local relative humidity & temperature auto-pulled for check-in dates. Always framed as an observational variable — not a causal factor.
        </div>
      </div>
    </div>
  );
}
