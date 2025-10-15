
import PostLayoutComponents from "../../components/PostLayout";


export default function PostLayout({
    children,
    }:  Readonly<{children: React.ReactNode;
    }>) {
    return (
        <div>
            <PostLayoutComponents>
                {children}
            </PostLayoutComponents>
        </div>
    );
}
