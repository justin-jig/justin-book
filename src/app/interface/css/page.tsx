
import { getAllPosts } from '../../../lib/api';

const HTML = async () => {

    const posts = await getAllPosts('intereface/html');

    return(
        <div>
            <h1>준비중</h1>
        </div>
    )
}
export default HTML;