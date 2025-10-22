
import { ALLOWED_SEGMENTS } from '../../../common/define/navigation'
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ sections: string, segment: string}>
}
export const dynamicParams = false; // 이외의 값은 404

export default async function Page({ params }: PageProps) {
    const { sections, segment }:{sections: string, segment: string} = await params;

    if (sections && !ALLOWED_SEGMENTS[sections].includes(segment)) {
        // 404 처리
        return notFound();
    }
    return(
        <div>HTML</div>
    )
}


// 🔹 1) generateStaticParams() — 빌드 시 생성할 경로를 명시
export function generateStaticParams() {

  return Object.entries(ALLOWED_SEGMENTS).flatMap(([sections, segments]) =>
    segments.map((segment) => ({
      sections,
      segment,
    }))
  );
}


