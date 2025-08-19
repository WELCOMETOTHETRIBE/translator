"use client";
import React from "react";
import { Language } from "@/lib/types";

type Props = {
  languages: Language[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
};

export default function LanguageSelect({ 
  languages, 
  value, 
  onChange, 
  label, 
  placeholder = "Select language" 
}: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="glass-input w-full appearance-none pr-10"
        >
          <option value="" className="bg-gray-800 text-white">
            {placeholder}
          </option>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
              {lang.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 