// app/not-found.tsx
"use client";

import { useRouter } from "next/navigation";
import "./Notfound.scss";

export default function NotFoundComponent() {
  const router = useRouter();

  return (
    <div className="notfound-container">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">페이지를 찾을 수 없습니다.</p>
      <button className="notfound-button" onClick={() => router.back()}>
        ← 뒤로가기
      </button>
    </div>
  );
}
