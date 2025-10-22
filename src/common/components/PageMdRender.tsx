"use client";
import { useEffect } from "react";
import mermaid from "mermaid";

export default function MermaidInit(params:{title:string, date:string, html:string}) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.classList.contains("dark")
        ? "dark"
        : "neutral",
    });
    mermaid.contentLoaded();
  }, []);

  return (
    <>
      <h1>{params.title}</h1>
      <h4>{params.date}</h4>
      <div dangerouslySetInnerHTML={{ __html: params.html }} />
    </>
    
  );
}
