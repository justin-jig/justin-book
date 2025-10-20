'use client';
import Link from "next/link";

import { JSX, useEffect, useState } from "react";
import './MainMenu.scss';

type NavigationItemProps = {
  menu: string[];
  submenu: {children:{path :string, name: string, key : string, active:boolean}[]}[];
};


export default function  MainMenu({ menu, submenu }: NavigationItemProps): JSX.Element {
 
    const [menuIndex, setMenuIndex] = useState<number>(0);
    
    return (
        <>
            <div className="main_menu">
                <div className="menu_section">
                    {menu.map((item, index) => (
                        <ul key={index} className="menu_item">
                            <li className={menuIndex === index ? "active": ""}
                                onClick={() => setMenuIndex(index)}
                            >{item}</li>
                        </ul>
                    )) }
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
