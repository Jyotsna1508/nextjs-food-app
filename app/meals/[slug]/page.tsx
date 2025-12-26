import Image from 'next/image';
import classes from './page.module.css';
import { getMeal } from '@/app/lib/lib';
import notFound from '@/app/not-found';

export async function generateMetadata({params}: any){
    const { slug } = await params;
    const data: any = getMeal(slug);
    if(!data){
        notFound();
    }
    return {
        title: data.title,
        description: data.summary
    }
}
export default async function MealsDetailsPage({params}: any){
    const { slug } = await params;
    const data: any = getMeal(slug);
    if(!data){
        notFound();
    }
    return <>
    <header className={classes.header}>
        <div className={classes.image}>
            <Image src={data.image} alt={data.title} fill/>
        </div>
        <div className={classes.headerText}>
            <h1></h1>
            <p className={classes.creator}>
                by <a href={`mailto:${data.creator_email}`}>{data.creator}</a>
            </p>
        </div>
    </header>
    <main>
        <p className={classes.instructions} dangerouslySetInnerHTML={{
            __html: data.instructions
        }}>
        </p>
    </main>
    </>
}