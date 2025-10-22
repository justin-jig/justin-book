'use client';
import Link from "next/link";

import { JSX, useEffect, useState,useRef, TouchEvent, MouseEvent } from "react";
import './MainMenu.scss';

type NavigationItemProps = {
  menu: string[];
  submenu: {children:{path :string, name: string, key : string, active:boolean}[]}[];
};


export default function  MainMenu({ menu, submenu }: NavigationItemProps): JSX.Element {

    const scrollRef = useRef<HTMLUListElement>(null);
    const [menuIndex, setMenuIndex] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    
    // 마우스 이벤트
    const handleMouseDown = (e: MouseEvent<HTMLUListElement, globalThis.MouseEvent>) => {
        if (!scrollRef.current) return;
        e.stopPropagation();
        e.preventDefault
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);

    const handleMouseMove = (e: MouseEvent<HTMLUListElement, globalThis.MouseEvent>) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // 터치 이벤트
    const handleTouchStart = (e:TouchEvent<HTMLUListElement>) => {
        if (!scrollRef.current) return;
        e.stopPropagation();
        e.preventDefault
        setIsDragging(true);
        setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent<HTMLUListElement>) => {
        if (!isDragging || !scrollRef.current) return;
         e.stopPropagation();
        e.preventDefault
        const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchEnd = () => setIsDragging(false);

    const menuClick = (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>, index:number) => {
        e.stopPropagation();
        e.preventDefault
        if (!scrollRef.current) return;
        if(menuIndex===index) return;
        if(index === 0) {
            scrollRef.current.scrollLeft = 0;
        } else if (index === 1){
            scrollRef.current.scrollLeft = 80;
        } else if (index === 2){
            scrollRef.current.scrollLeft = 140;
        }  else {
        const clickX = e.pageX - scrollRef.current.offsetLeft;
        scrollRef.current.scrollLeft = clickX;
        }

        setMenuIndex(index)
    };

    const scrollMoveLeft = () => {
        if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollMoveRight = () => {
        if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };



    return (
        <>
            <div className="main_menu">
                <div className="menu_section">

                    <div className="move-btn">
                        <button  onClick={scrollMoveLeft} className="scroll-btn" aria-label="왼쪽으로 이동">
                            <svg viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                        </button>
                        <button onClick={scrollMoveRight} className="scroll-btn" aria-label="오른쪽으로 이동">
                            <svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                    <ul  ref={scrollRef} 
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}>
                        {menu.map((item, index) => (
                            <li key={index} className={menuIndex === index ? "menu_item active": "menu_item"}
                                onClick={(e) => menuClick(e,index)}>
                                    {item}
                            </li>
                        )) }
                    </ul>
                </div>
                <div>
                    {submenu.map((nav, index) => {
                        if(index === menuIndex) return (
                            <div key={index} className="sub_menu">
                                {nav.children.map((child) => (
                                    <div key={child.key} className="menu">
                                        <Link href={child.path}>📂 {child.name}</Link>
                                    </div>
                                ))}
                            </div>
                        )
                        return null;
                    })}

                </div>
            </div>
        </>
    )
}
