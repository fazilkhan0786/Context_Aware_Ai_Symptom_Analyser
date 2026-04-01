/**
 * AI Symptom Checker - Next.js Configuration
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Next.js configuration with project metadata
 */

import type { NextConfig } from "next";

// Project Metadata
export const PROJECT_METADATA = {
  name: "AI Symptom Checker",
  version: "0.1.0",
  author: {
    name: "Fazilkhan Malek",
    github: "https://github.com/fazilkhan0786",
    email: "contact@fazilkhanmalek.com",
  },
  createdYear: 2026,
  license: "MIT with Attribution",
  copyright: "Copyright (c) 2026 Fazilkhan Malek",
  projectInitiative: "NuroVed",
  parentVision: "Promacle",
  repository: "https://github.com/fazilkhan0786/Context_Aware_Ai_Symptom_Analyser",
  description: "AI-powered bilingual symptom analyzer using Groq API",
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
