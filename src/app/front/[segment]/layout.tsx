

import Link from "next/link";
import styles from './layout.module.scss';

import PostLayoutComponents from "../../../common/components/PostLayout";
import PageTop from "../../../common/components/PageTop";
import NavigationItem from "../../../common/components/NavigationItem";
import { getAllPostsTitle } from '../../../lib/api';

import { Sections } from "../../../common/define/navigation";

type PageProps = {
  params: Promise<{ segment: string}>
}

export default async function PostLayout({
    children,
    params
    }:  Readonly<{children: React.ReactNode
        params:PageProps["params"]
    }>) {

    const { segment } = await params;

    
    const posts:string[] = await getAllPostsTitle(`${Sections[0]}/`+ segment);

    return (
        <div className={styles.layout}>
            <div className={styles.left}>
                <header><Link href={'/'}>Justin-book</Link></header>
                <div className={styles.navigation}>
                    <NavigationItem url={`${Sections[0]}/`+ segment} posts={posts} />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.contentsHeader}></div>
                <PostLayoutComponents>
                    {children}
                </PostLayoutComponents>
            </div>
            <PageTop />
        </div>
    );
}
