import Link from "next/link";
import classes from "./page.module.css";
import MealsGrid from "@/components/meals/meals-grid";
import { getMeals } from "../lib/lib";
import { Suspense } from "react";

async function Meals() {
 const meals = await getMeals();
 return  <MealsGrid meals={meals}/>
}
export default async function MealsPage(){
    return (
        <>
            <header className={classes.header}>
                <h1>
                    Delicious meals, created{''}
                    <span className={classes.highlight}>By you</span>
                </h1>
                <p>
                    Choose your fav recipe and cook it yourself.Its wasy and fun!
                </p>
                <p className={classes.cta}>
                    <Link href="/meals/share">
                     Share your recipe
                    </Link>
                </p>
            </header>
            <main className={classes.main}>
               <Suspense fallback={<p className={classes.loading}>Loading Meals...</p>}>
                    <Meals />
               </Suspense>
            </main>
        </>
    )
}