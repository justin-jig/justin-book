import type { NextConfig } from "next";
import withMDX from "@next/mdx";

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
});


const nextConfig: NextConfig = {
  output: "export", // 정적 사이트 생성
  basePath: "/justin-book", // 모든 경로 앞에 붙는 prefix
  assetPrefix: "/justin-book/", // 정적 파일 경로 맞춤
  images: {
    unoptimized: true, // export 모드에서는 필수
  },
  trailingSlash: true, // export 모드에서 권장: 각 페이지가 폴더처럼 처리됨
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'], // MDX 파일도 페이지로 인식


};

export default withMDXConfig(nextConfig);

