
import PostLayoutComponents from "../../../common/components/PostLayout";
import { getAllPostsTitle } from '../../../lib/api';
import Link from "next/link";
import styles from './layout.module.scss';

export default async function PostLayout({
    children,
    }:  Readonly<{children: React.ReactNode;
    }>) {

     const posts = await getAllPostsTitle('interface/svg');
    return (
        <div className={styles.layout}>
            <div className={styles.left}>
                <header><Link href={'/'}>justin-book</Link></header>
                <div>
                    {posts.map((data,idx) => {
                        return(
                            <div key={idx}>
                                <Link href={`/interface/svg/${data}`} >{data}</Link>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.contentsHeader}></div>
                <PostLayoutComponents>
                    {children}
                </PostLayoutComponents>
            </div>
        </div>
    );
}
