'use server';

import { redirect } from 'next/navigation';
import { saveMeal, Meal } from './lib';
import { revalidatePath } from 'next/cache';

function isInvalidText(text?: string) {
  return !text || text.trim() === '';
}

export default async function shareMeal(formData: FormData) {
  // Build Meal object
  const meal: Meal = {
    title: (formData.get('title') as string) || '',
    summary: (formData.get('summary') as string) || '',
    instructions: (formData.get('instructions') as string) || '',
    creator_email: (formData.get('email') as string) || '',
    creator: (formData.get('name') as string) || '',
    image: formData.get('image') as string | File,
  };

  // Validation
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator_email) ||
    isInvalidText(meal.creator) ||
    !meal.creator_email.includes('@') ||
    !meal.image || !(meal.image instanceof File) ||
    meal.image.size === 0
  ) {
    return {
      message: 'Invalid data. Please fill all required fields correctly.',
    };
  }

  // Save meal to DB
  await saveMeal(meal);

  //dont render cached page
  revalidatePath('/meals');
  // Redirect after success
  redirect('/meals');
}
