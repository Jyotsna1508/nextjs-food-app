// lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs/promises';

export interface Meal {
  title: string;
  summary: string;
  instructions: string;
  creator: string;
  creator_email: string;
  image: File | string;
  slug?: string;
}

// Absolute path to DB (works in dev and prod)
const dbPath = path.resolve('./meals.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    image TEXT NOT NULL,
    summary TEXT NOT NULL,
    instructions TEXT NOT NULL,
    creator TEXT NOT NULL,
    creator_email TEXT NOT NULL
  )
`).run();

// Seed data if table is empty
const result = db.prepare('SELECT COUNT(*) as count FROM meals').get() as { count: number };
const rowCount = result.count;

if (rowCount === 0) {
  const dummyMeals: Meal[] = [
    { slug: 'juicy-cheese-burger', title: 'Juicy Cheese Burger', image: '/images/burger.jpg', summary: 'A juicy burger', instructions: '1. Prepare patty...\n2. Cook patty...\n3. Assemble burger', creator: 'John Doe', creator_email: 'johndoe@example.com' },
    { slug: 'spicy-curry', title: 'Spicy Curry', image: '/images/curry.jpg', summary: 'A spicy curry', instructions: '1. Chop veggies...\n2. Sauté veggies...\n3. Add curry paste', creator: 'Max Schwarz', creator_email: 'max@example.com' },
    { slug: 'homemade-dumplings', title: 'Homemade Dumplings', image: '/images/dumplings.jpg', summary: 'Tender dumplings', instructions: '1. Prepare filling...\n2. Fill dumplings...\n3. Steam them', creator: 'Emily Chen', creator_email: 'emilychen@example.com' },
    { slug: 'classic-mac-n-cheese', title: 'Classic Mac n Cheese', image: '/images/macncheese.jpg', summary: 'Creamy mac & cheese', instructions: '1. Cook pasta...\n2. Make cheese sauce...\n3. Combine', creator: 'Laura Smith', creator_email: 'laurasmith@example.com' },
    { slug: 'authentic-pizza', title: 'Authentic Pizza', image: '/images/pizza.jpg', summary: 'Hand-tossed pizza', instructions: '1. Prepare dough...\n2. Add toppings...\n3. Bake', creator: 'Mario Rossi', creator_email: 'mariorossi@example.com' },
    { slug: 'wiener-schnitzel', title: 'Wiener Schnitzel', image: '/images/schnitzel.jpg', summary: 'Crispy veal cutlet', instructions: '1. Prepare veal...\n2. Bread and fry', creator: 'Franz Huber', creator_email: 'franzhuber@example.com' },
    { slug: 'fresh-tomato-salad', title: 'Fresh Tomato Salad', image: '/images/tomato-salad.jpg', summary: 'Refreshing salad', instructions: '1. Slice tomatoes...\n2. Add dressing', creator: 'Sophia Green', creator_email: 'sophiagreen@example.com' },
  ];

  const insert = db.prepare(`
    INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
    VALUES (@slug, @title, @image, @summary, @instructions, @creator, @creator_email)
  `);

  for (const meal of dummyMeals) insert.run(meal);
  console.log('DB seeded with dummy meals!');
}

// Export function to get all meals
export function getMeals(): Meal[] {
  return db.prepare('SELECT * FROM meals').all() as Meal[];
}

// Export function to get a meal by slug
export function getMeal(slug: string): Meal | undefined {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug) as Meal | undefined;
}

// Export function to save a meal
export async function saveMeal(meal: Meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  // Save image if it's a File
  if (meal.image instanceof File) {
    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;
    const filePath = `public/images/${fileName}`;
    const buffer = Buffer.from(await meal.image.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    meal.image = `/images/${fileName}`;
  }

  // Insert into DB
  db.prepare(`
    INSERT INTO meals
      (title, summary, instructions, creator, creator_email, image, slug)
    VALUES (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
  `).run(meal);
}
