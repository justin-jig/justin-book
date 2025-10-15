import { getPostById, getAllPosts } from '../../../../lib/api';

type PageProps = {
  params: Promise<{ id: string }>
}
const Post = async ({ params }: PageProps) => {
  const { id } = await params;
  const { html, title, date } = await getPostById('interface/html', id);
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
  const posts = await getAllPosts('interface/html');
  return posts.map(post => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { title } = await getPostById('interface/html', id);
  if (!title) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title,
  };
}