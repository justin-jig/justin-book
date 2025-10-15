import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const postsDirectory = path.join(process.cwd(), '_posts');

function getPostFiles() {
  return fs.readdirSync(postsDirectory);
}

function getParser() {
  return unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeStringify)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      content: arg => ({
        type: 'element',
        tagName: 'a',
        properties: {
          href: `#${String(arg.properties?.id)}`,
          style: 'margin-right: 10px',
        },
        children: [{ type: 'text', value: '#' }],
      }),
    });
}

const parser = getParser();

// 특정 글의 데이터를 가져온다
export async function getPostById(id: string) {
  const realId = id.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realId}.md`);
  const { data, content } = matter(await fs.promises.readFile(fullPath, 'utf8'));

  const html = await parser.process(content);
  const date = data.date as Date;

  return {
    ...data,
    title: data.title as string,
    id: realId,
    date: `${date.toISOString().slice(0, 10)}`,
    html: html.value.toString(),
  };
}

// 모든 글의 데이터를 가져온다.
export async function getAllPosts() {
  const posts = await Promise.all(getPostFiles().map(id => getPostById(id)));
  // 날짜 내림차순 정렬
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}