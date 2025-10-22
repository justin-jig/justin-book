import Link from 'next/link';

import { navigation, Sections } from '../common/define/navigation';
import styles from './page.module.scss';

import SocialLink from '../common/components/SocialLink';
import MainMenu from '../common/components/MainMenu';

const Page = async () => {

  return (
    <div className={styles.container}>
        <div className={styles.contents}>
            <div className={styles.contenstBox}>
                <h4>Welcome</h4>
                <h1>Justin Books</h1>

                <MainMenu menu={Sections} submenu={navigation}/>
                <SocialLink/>
            </div>
        </div>
    </div>
  );
};
export default Page;