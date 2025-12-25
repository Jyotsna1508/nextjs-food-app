import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('./meals.db');
const db = new Database(dbPath);

// Create table
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

// Seed data only if empty
const rowCount = db.prepare('SELECT COUNT(*) as count FROM meals').get().count;
if (rowCount === 0) {
  const dummyMeals = [
    {
      slug: 'juicy-cheese-burger',
      title: 'Juicy Cheese Burger',
      image: '/images/burger.jpg',
      summary: 'A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.',
      instructions: '1. Prepare patty...\n2. Cook patty...\n3. Assemble burger...',
      creator: 'John Doe',
      creator_email: 'johndoe@example.com'
    },
    {
      slug: 'spicy-curry',
      title: 'Spicy Curry',
      image: '/images/curry.jpg',
      summary: 'A rich and spicy curry, infused with exotic spices and creamy coconut milk.',
      instructions: '1. Chop veggies...\n2. Sauté veggies...\n3. Add curry paste...',
      creator: 'Max Schwarz',
      creator_email: 'max@example.com'
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
    VALUES (@slug, @title, @image, @summary, @instructions, @creator, @creator_email)
  `);

  for (const meal of dummyMeals) {
    stmt.run(meal);
  }

  console.log('Database seeded successfully!');
} else {
  console.log('Database already has meals.');
}

db.close();
