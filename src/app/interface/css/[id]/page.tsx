import { getPostById, getAllPosts } from '../../../lib/api';

type Props = {
  params: Promise<{ id: string }>
}
const Post = async ({ params }: Props) => {
  const { id } = await params;
  const { html, title, date } = await getPostById(id);
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
  const posts = await getAllPosts();

  return posts.map(post => ({
    id: post.id,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { title } = await getPostById(id);
  if (!title) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title,
  };
}