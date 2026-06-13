"use client";

import { useState, useMemo } from "react";
import { type Locale } from "@/lib/i18n";

interface MortgageCalculatorProps {
  propertyPrice?: number;
  locale: Locale;
}

const DEFAULT_INTEREST_RATE = 6.5;
const DEFAULT_LOAN_TERM = 25;
const DEFAULT_DOWN_PAYMENT_PERCENT = 20;

export function MortgageCalculator({ propertyPrice, locale }: MortgageCalculatorProps) {
  const nonTh = locale !== "th";
  
  const [price, setPrice] = useState(propertyPrice || 5000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULT_DOWN_PAYMENT_PERCENT);
  const [interestRate, setInterestRate] = useState(DEFAULT_INTEREST_RATE);
  const [loanTerm, setLoanTerm] = useState(DEFAULT_LOAN_TERM);
  const [expanded, setExpanded] = useState(!!propertyPrice);

  const calculation = useMemo(() => {
    const downPayment = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return {
        monthlyPayment: loanAmount / numberOfPayments,
        totalPayment: loanAmount,
        totalInterest: 0,
        loanAmount,
        downPayment,
      };
    }

    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;

    return {
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanAmount,
      downPayment,
    };
  }, [price, downPaymentPercent, interestRate, loanTerm]);

  const formatNumber = (n: number) => {
    return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US").format(Math.round(n));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {nonTh ? "Mortgage Calculator" : "คำนวณสินเชื่อ"}
            </p>
            {!expanded && (
              <p className="text-sm text-slate-500">
                {nonTh ? "Estimate your monthly payment" : "ประมาณการผ่อนต่อเดือน"}
              </p>
            )}
          </div>
        </div>
        <svg
          className={`h-5 w-5 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-4">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {nonTh ? "Property Price (฿)" : "ราคาทรัพย์ (บาท)"}
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-500 focus:ring-2"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
                <span>{nonTh ? "Down Payment" : "เงินดาวน์"}</span>
                <span className="text-teal-600">{downPaymentPercent}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                className="w-full accent-teal-600"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-500">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {nonTh ? "Interest Rate (%)" : "ดอกเบี้ย (%)"}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-500 focus:ring-2"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {nonTh ? "Loan Term (years)" : "ระยะเวลา (ปี)"}
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-teal-500 focus:ring-2"
                >
                  <option value={10}>10 {nonTh ? "years" : "ปี"}</option>
                  <option value={15}>15 {nonTh ? "years" : "ปี"}</option>
                  <option value={20}>20 {nonTh ? "years" : "ปี"}</option>
                  <option value={25}>25 {nonTh ? "years" : "ปี"}</option>
                  <option value={30}>30 {nonTh ? "years" : "ปี"}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-teal-50 p-4">
            <div className="text-center">
              <p className="text-sm text-teal-700">
                {nonTh ? "Estimated Monthly Payment" : "ประมาณการผ่อนต่อเดือน"}
              </p>
              <p className="mt-1 text-3xl font-bold text-teal-700">
                ฿{formatNumber(calculation.monthlyPayment)}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg bg-white p-3">
                <p className="text-slate-500">{nonTh ? "Down Payment" : "เงินดาวน์"}</p>
                <p className="font-semibold text-slate-900">฿{formatNumber(calculation.downPayment)}</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-slate-500">{nonTh ? "Loan Amount" : "วงเงินกู้"}</p>
                <p className="font-semibold text-slate-900">฿{formatNumber(calculation.loanAmount)}</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-slate-500">{nonTh ? "Total Interest" : "ดอกเบี้ยรวม"}</p>
                <p className="font-semibold text-slate-900">฿{formatNumber(calculation.totalInterest)}</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-slate-500">{nonTh ? "Total Payment" : "ยอดชำระรวม"}</p>
                <p className="font-semibold text-slate-900">฿{formatNumber(calculation.totalPayment)}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {nonTh
              ? "* This is an estimate only. Actual rates may vary by bank and credit profile."
              : "* นี่เป็นการประมาณการเท่านั้น อัตราจริงอาจแตกต่างตามธนาคารและเครดิตของผู้กู้"}
          </p>
        </div>
      )}
    </div>
  );
}
