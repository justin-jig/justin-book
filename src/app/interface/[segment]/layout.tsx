

import Link from "next/link";
import styles from './layout.module.scss';

import PostLayoutComponents from "../../../common/components/PostLayout";
import PageTop from "../../../common/components/PageTop";
import NavigationItem from "../../../common/components/NavigationItem";
import { getAllPostsTitle } from '../../../lib/api';

export default async function PostLayout({
    children
    }:  Readonly<{children: React.ReactNode;
    }>) {
    
    const posts:string[] = await getAllPostsTitle('interface/html');

    return (
        <div className={styles.layout}>
            <div className={styles.left}>
                <header><Link href={'/'}>Justin-book</Link></header>
                <div className={styles.navigation}>
                    <NavigationItem url={'/interface/html'} posts={posts} />
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
