import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  // theme: {
  //   extend: {
  //     typography: {
  //       DEFAULT: {
  //         css: {
  //           color: "#334155",
  //           h1: { fontWeight: "700", color: "#0f172a" },
  //           h2: { fontWeight: "600", color: "#0f172a" },
  //           a: { color: "#2563eb", textDecoration: "none" },
  //           "a:hover": { textDecoration: "underline" },
  //           code: {
  //             backgroundColor: "#f1f5f9",
  //             padding: "0.125rem 0.25rem",
  //             borderRadius: "0.25rem",
  //           },
  //         },
  //       },
  //     },
  //   },
  // },
  plugins: [typography],
  
  // 혹시 동적/MDX 내부 클래스가 사라지면 주석 해제
} satisfies Config;
