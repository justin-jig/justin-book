
import { ALLOWED_SEGMENTS_front } from '../../../common/define/navigation'
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ segment: string, id: string }>
}
export const dynamicParams = false; // 이외의 값은 404

export default async function Page({ params }: PageProps) {
    const { segment } = await params;

    if (!ALLOWED_SEGMENTS_front.includes(segment as string)) {
        // 404 처리
        return notFound();
    }
    return(
        <div>HTML</div>
    )
}
// 🔹 1) generateStaticParams() — 빌드 시 생성할 경로를 명시
export function generateStaticParams() {
  return ALLOWED_SEGMENTS_front.map((segment) => ({ segment }));
}


