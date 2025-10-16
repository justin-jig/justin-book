'use client';

export default function PageTop() {
    const pageTop = () => {
        window.scrollTo({top:0, left:0, behavior:'smooth'});
    }
    return (
        <div style={{ position: 'fixed', bottom: '15px', right: '15px', cursor: 'pointer', fontSize: '2rem'
        }} onClick={()=> pageTop()}>⬆️</div>
    )
}
