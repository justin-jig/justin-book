
// output: "export" 에서는 동적 파라미터가 불가능하기 때문에
// 허용할 segment 목록을 미리 지정해야 함

// export const Sections:string[]= ["cs", "front","back","ai", "oss"] as const;

export const Sections:string[]= ["cs", "system", "language", "front", "back"] as const;

export const ALLOWED_SEGMENTS: Record<string, readonly string[]> = {
    cs: ["FND", "Arch", "DSA", "os", "network"],
    system:["infra","cloud", "ubuntu", "docker"],
    language: ["javascript", "typescript", "nodejs", "java", "python"],
    front: ["core", "module", "ui", "buildTools", "react", "next"],
    back: ["core", "express", "nestjs", "spring", "flask", "postgreSQL"]
} as const;

// back: ["core", "node", "spring boot", "api", "security"]

export const navigation = Sections.map((section) => ({
  children: (ALLOWED_SEGMENTS[section] || []).map((seg) => ({
    path: `/${section}/${seg}`,
    name: seg,
    key: seg,
    active: true,
  })),
}));
