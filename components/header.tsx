'use client';
import Image from "next/image";
import Link from "next/link";
import logoImg from "@/assets/logo.png";
import classes from './header.module.css';
import { usePathname } from "next/navigation";
export default function MainHeader(){
    const path = usePathname();
    return <header className={classes.header}>
        <Link href="/" className={classes.logo}>
            <Image src={logoImg} alt="logo" priority/>
            NextLevel Food
        </Link>
        <nav className={classes.nav}>
            <ul>
                <li> 
                    <Link href="/meals" className={path.startsWith('/meals')? classes.active : undefined}>Browse Meals</Link>
                    <Link href="/community" className={path.startsWith('/community')? classes.active : undefined}>Community</Link>
                </li>
            </ul>
        </nav>
    </header>
}