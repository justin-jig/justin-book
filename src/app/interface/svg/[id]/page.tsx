import { getPostById, getAllPosts } from '../../../../lib/api';

type PageProps = {
  params: { id: string }
}
const Post = async ({ params }: PageProps) => {
  const { id } =  params;
  const { html, title, date } = await getPostById('interface/svg', id);
  return (
    <article>
      <h1>{title}</h1>
      <h4>{date}</h4>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};

export default Post;

export async function generateStaticParams() {
  const posts = await getAllPosts('interface/svg');
  return posts.map(post => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { title } = await getPostById('interface/svg', id);
  if (!title) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title,
  };
}