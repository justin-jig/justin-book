'use client';
import Link from "next/link";
import { useParams } from 'next/navigation';
import { JSX, useEffect } from "react";
import { redirect } from 'next/navigation';

import './NavigationItem.scss';

type NavigationItemProps = {
  url: string;
  posts: string[];
};

const naviItemStyle = {
    marginBottom: '8px',
    fontSize: '1rem',
};

export default function  NavigationItem({ url, posts }: NavigationItemProps): JSX.Element {
    const params = useParams();
    /**추후 해제 */
    useEffect(() => {
        if (!params?.id && posts.length > 0) {
            redirect(`/${url}/${posts[0]}`);
        }
    },[])
 
    return (
        <>
            {posts.map((data,idx) => {
                return(
                    <div className="naviItem" key={idx}>
                        <Link href={`/${url}/${data}`} style={params?.id === data ? {fontWeight:"bold"}:{}} >{data}</Link>
                    </div>
                )
            })}
        </>
    )
}
