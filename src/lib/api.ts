import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkEmoji from 'remark-emoji';
import rehypeHighlight from "rehype-highlight";
import { unified } from 'unified';


function getPostFiles(postsDirectory:string) {
  return fs.readdirSync( postsDirectory);
}
function getParser() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)      
    .use(rehypeHighlight) // ✅ 하이라이트 추가
    .use(remarkEmoji, { emoticon: true })                             // ⬅️ GFM은 rehype 변환 전에
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)                                   // ⬅️ MD 안의 원시 HTML 처리
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      //properties: { className: ["heading-anchor"] },
      content: [], // 기호 안 붙이기
      test: ["a"], // ✅ h1은 제외!
    })
    // .use(rehypeHighlight)                          // (선택) 코드 하이라이트
    .use(rehypeStringify);                            // ⬅️ 한 번만
}
const parser = getParser();

export async function getPostById(request: string, id: string) {
  const realId = id.replace(/\.md$/, "");

  const postsDirectory:string = path.join(process.cwd(), '/src/_posts/'+ request);
  const fullPath = path.join(postsDirectory, `${realId}.md`);
  const { data, content } = matter(await fs.promises.readFile(fullPath, "utf8"));

  const file = await parser.process(content);
  const html = String(file); // or String(file.value)
  const date = data.date as Date;

  return {
    ...data,
    title: data.title as string,
    id: realId,
    date: date.toISOString().slice(0, 10),
    html,
  };
}

export async function getPostById2(postsDirectory: string, id: string) {
  const realId = id.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realId}.md`);
  const { data, content } = matter(await fs.promises.readFile(fullPath, "utf8"));

  const file = await parser.process(content);
  const html = String(file); // or String(file.value)
  const date = data.date as Date;

  return {
    ...data,
    title: data.title as string,
    id: realId,
    date: date.toISOString().slice(0, 10),
    html,
  };
}

// 모든 글의 데이터를 가져온다.
export async function getAllPosts(reqyestPost:string) {

  const postsDirectory:string = path.join(process.cwd(), '/src/_posts/'+ reqyestPost);
  const posts = await Promise.all(getPostFiles(postsDirectory).map(id => getPostById2(postsDirectory, id)));
  // 날짜 내림차순 정렬
  return posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
}

export async function getAllPostsTitle(reqyestPost:string) {

  const postsDirectory:string = path.join(process.cwd(), '/src/_posts/'+ reqyestPost);
  const posts = await Promise.all(getPostFiles(postsDirectory).map(id => id.replace(/\.md$/, "")));
  // 날짜 내림차순 정렬
  return posts.sort();
}