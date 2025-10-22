import { getPostById, getAllPostsTitle } from '../../../../lib/api';
import { notFound } from "next/navigation";
import { Sections, ALLOWED_SEGMENTS } from '../../../../common/define/navigation'
import MermaidInit from '../../../../common/components/PageMdRender';


type PageProps = {
  params: Promise<{ sections: string, segment: string, id: string }>
}

export const dynamic = "error";       // 동적 렌더링 금지
export const revalidate = false;      // ISR 비활성화
export const dynamicParams = false;   // generateStaticParams 이외 404



export async function generateStaticParams() {
  const params: { sections: string; segment: string; id: string }[] = [];

    for (const sections of Sections) {
            const segments = ALLOWED_SEGMENTS[sections] || [];
            for (const segment of segments) {
            const posts = await getAllPostsTitle(`${sections}/${segment}`);
            for (const id of posts) {
                params.push({ sections, segment, id });
            }
        }
    }
    return params;
}


const Post = async ({ params }: PageProps) => {

    const {sections,  segment, id } = await params;

    const { html, title, date } = await getPostById(`${sections}/${segment}`, id);
    
    if (id === null || segment === null) return notFound();
    return (
        <article className='markdown-body'>
            <MermaidInit title={title} date={date} html={html}/>
           
        </article>
    );
};

export default Post;