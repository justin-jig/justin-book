import Link from 'next/link';
import { getAllPosts } from '../lib/api';


import { navigation } from '../define/navigation';
import styles from './page.module.scss';

const Page = async () => {
  //const posts = await getAllPosts();
  return (
    <div className={styles.container}>

        <div className={styles.contents}>
            <div className={styles.contenstBox}>
                <h4>Welcome</h4>
                <h1>Jusin Books</h1>
                <div className={styles.navigations}>
                    {navigation.map((nav, index) => (
                        <div key={index} className={styles.navItem}>
                            {nav.children.map((child) => (
                                <div key={child.key} className={styles.nav}>
                                    <Link href={child.path}>{child.name}</Link>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        {/* <div>
            {posts.map(({ id, date, title, html }) => (
            <article className={styles.post} key={id}>
                <h2 className={styles.postTitle}>
                <Link href={`/posts/${id}`}>
                    {date}
                </Link>
                <Link href={`/posts/${id}`}>
                    {title}
                </Link>
                </h2>
                <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: html }}
                />
            </article>
            ))}
        </div> */}
    </div>
  );
};
export default Page;