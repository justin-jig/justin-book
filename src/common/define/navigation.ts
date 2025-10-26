
// output: "export" 에서는 동적 파라미터가 불가능하기 때문에
// 허용할 segment 목록을 미리 지정해야 함

// export const Sections:string[]= ["cs", "front","back","ai", "oss"] as const;

export const Sections:string[]= ["cs", "system", "runtime", "front", "back"] as const;

export const ALLOWED_SEGMENTS: Record<string, readonly string[]> = {
    cs: ["collaborate", "computer", "DSA", "network"],
    system:["infra","cloud", "ubuntu", "docker"],
    runtime: ["mySQL","postgreSQL","rdis","javascript", "typescript", "nodejs", "java", "python"],
    front: ["core", "module", "ui", "buildTools", "react", "next"],
    back: ["core","log-test","async","express", "nestjs", "spring", "fastapi"]
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
