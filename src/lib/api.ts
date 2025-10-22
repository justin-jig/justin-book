import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Markdown 파싱 관련 플러그인
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkRehype from 'remark-rehype';
import rehypeRaw from "rehype-raw";
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from 'rehype-stringify';

import { visit } from "unist-util-visit";
import type { Root, Code } from "mdast";

// ✅ remark 플러그인: ```mermaid``` 블록을 <div class="mermaid">...</div> 로 변환
// → 나중에 클라이언트에서 Mermaid.js가 렌더링할 수 있게끔 처리
function remarkMermaidAsHtml() {
  return (tree: Root) => {
    visit(tree, "code", (node, index, parent) => {
      const code = node as Code;
      if (code.lang === "mermaid" && parent && typeof index === "number") {
        parent.children[index] = {
          type: "html",
          value: `<div class="mermaid">${code.value}</div>`,
        } as any; // HTML 노드 삽입
      }
    });
  };
}

// ✅ 지정 폴더 내 파일 목록 반환
function getPostFiles(postsDirectory: string) {
  return fs.readdirSync(postsDirectory);
}

// ✅ Markdown → HTML 변환 파서 설정
function getParser() {
  return unified()
    .use(remarkParse)                              // MD 문법 파싱
    .use(remarkGfm)                                // GFM 확장 (표, 체크박스 등)
    .use(remarkMermaidAsHtml)                      // mermaid 코드 블록 처리
    .use(rehypeHighlight)                          // 코드 하이라이팅
    .use(remarkEmoji, { emoticon: true })          // 이모지 변환 (:smile:)
    .use(remarkRehype, { allowDangerousHtml: true }) // remark → rehype 변환
    .use(rehypeRaw)                                // MD 내부 HTML 그대로 렌더
    .use(rehypeSlug)                               // heading에 id 추가 (#heading)
    .use(rehypeAutolinkHeadings, {                 // 제목에 자동 앵커 링크 추가
      behavior: "wrap",
      content: [], // 기호 없이 링크만 감쌈
      test: ["a"],
    })
    .use(rehypeStringify);                         // HTML 문자열로 변환
}

const parser = getParser();

// ✅ 개별 포스트 읽기 (디렉토리 이름 + 파일 이름)
export async function getPostById(request: string, id: string) {
  const realId = id.replace(/\.md$/, ""); // .md 확장자 제거
  const postsDirectory = path.join(process.cwd(), '/src/_posts/' + request);
  const fullPath = path.join(postsDirectory, `${realId}.md`);

  // gray-matter: Frontmatter(메타데이터) + 본문 분리
  const { data, content } = matter(await fs.promises.readFile(fullPath, "utf8"));

  // Markdown → HTML 변환
  const file = await parser.process(content);
  const html = String(file);
  const date = data.date as Date;

  // 최종 반환 객체
  return {
    ...data,
    title: data.title as string,
    id: realId,
    date: date.toISOString().slice(0, 10),
    html,
  };
}

// ✅ getPostById와 거의 동일 (postsDirectory 직접 전달용)
export async function getPostById2(postsDirectory: string, id: string) {
  const realId = id.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realId}.md`);
  const { data, content } = matter(await fs.promises.readFile(fullPath, "utf8"));

  const file = await parser.process(content);
  const html = String(file);
  const date = data.date as Date;

  return {
    ...data,
    title: data.title as string,
    id: realId,
    date: date.toISOString().slice(0, 10),
    html,
  };
}


// ✅ 모든 포스트 데이터 불러오기 + 날짜 내림차순 정렬
export async function getAllPosts(reqyestPost: string) {
  const postsDirectory = path.join(process.cwd(), '/src/_posts/' + reqyestPost);
  const posts = await Promise.all(
    getPostFiles(postsDirectory).map(id => getPostById2(postsDirectory, id))
  );
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}


// ✅ 모든 포스트 제목(ID)만 가져오기
export async function getAllPostsTitle(reqyestPost: string) {
  const postsDirectory = path.join(process.cwd(), '/src/_posts/' + reqyestPost);
  const posts = await Promise.all(
    getPostFiles(postsDirectory).map(id => id.replace(/\.md$/, ""))
  );
  return posts.sort();
}
