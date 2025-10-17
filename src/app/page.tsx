import Link from 'next/link';

import { navigation } from '../common/define/navigation';
import styles from './page.module.scss';

import SocialLink from '../common/components/SocialLink';

const Page = async () => {
  return (
    <div className={styles.container}>
        <div className={styles.contents}>
            <div className={styles.contenstBox}>
                <h4>Welcome</h4>
                <h1>Justin Books</h1>
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
                <SocialLink/>
            </div>
        </div>
    </div>
  );
};
export default Page;