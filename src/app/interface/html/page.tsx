
import { getAllPosts } from '../../../lib/api';

const HTML = async () => {

    const posts = await getAllPosts('interface/html');

    return(
        <div>
            {posts.map(({ id, date, title, html },idx) => (

                <article key={id}
                className="prose prose-lg prose-slate mx-auto dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: html }}
                />  

            ))}
        </div>
    )
}
export default HTML;