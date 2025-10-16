import { getPostById, getAllPostsTitle } from '../../../../lib/api';
import { notFound } from "next/navigation";
import { ALLOWED_SEGMENTS_interface } from '../../../../common/define/navigation'


type PageProps = {
  params: Promise<{ segment: string, id: string }>
}
export const dynamic = "error";       // 동적 렌더링 금지
export const revalidate = false;      // ISR 비활성화
export const dynamicParams = false;   // generateStaticParams 이외 404

export async function generateStaticParams() {
    const params: { segment: string; id: string }[] = [];
    for (const segment of ALLOWED_SEGMENTS_interface) {
        const posts = await getAllPostsTitle(`interface/${segment}`);
        posts.map( id =>{
            params.push({ segment, id }); 
        })
    }
    return params;
}



const Post = async ({ params }: PageProps) => {

    const { id } = await params;
    const { html, title, date } = await getPostById('interface/html', id);
    
    if (id === null) return notFound();
    return (
        <article className='.markdown-body'>
            <h1>{title}</h1>
            <h4>{date}</h4>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
    );
};

export default Post;