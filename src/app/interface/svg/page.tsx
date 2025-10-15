
import { getAllPosts } from '../../../lib/api';

const HTML = async () => {

    const posts = await getAllPosts('interface/svg');

    return(
        <div>
            <h1>html</h1>
        </div>
    )
}
export default HTML;