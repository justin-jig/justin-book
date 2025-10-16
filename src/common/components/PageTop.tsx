'use client';

import './PageTop.scss'

export default function PageTop() {
    const pageTop = () => {
        window.scrollTo({top:0, left:0, behavior:'smooth'});
    }
    return (
        <div className='pagetop-button' onClick={()=> pageTop()}>↑</div>
    )
}
