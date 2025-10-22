
import { Sections } from '../../common/define/navigation'
import { notFound } from "next/navigation";


type PageProps = {
  params: Promise<{ sections: string}>
}
export const dynamicParams = false; // 이외의 값은 404

export default async function Page({ params }: PageProps) {
    const { sections } = await params;


    if (!Sections.includes(sections as string)) {
        // 404 처리
        return notFound();
    }
    return(
        <div>HTML</div>
    )
}
// 1) generateStaticParams() — 빌드 시 생성할 경로를 명시
export function generateStaticParams() {
  return Sections.map((sections) => ({ sections }));
}


