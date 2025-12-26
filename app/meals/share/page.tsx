'use client';

import { useState } from 'react';
import ImagePicker from '@/components/image-picker/image-picker';
import classes from './page.module.css';
import MealFormSubmit from '@/components/meal-form-submit';
import { useActionState } from 'react';
import shareMeal from '@/app/lib/actions';

export default function ShareMealPage() {
  const [pickedImage, setPickedImage] = useState<File | null>(null);

  const [state, formAction] = useActionState(
    async (_state: any, formData: FormData) => {
      // Add the picked image to FormData manually
      if (pickedImage) formData.set('image', pickedImage);
      return shareMeal(formData);
    },
    { message: '' }
  );

  return (
    <>
      <header className={classes.header}>
        <h1>
          Share your <span className={classes.highlight}>favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>

      <main className={classes.main}>
        <form className={classes.form} action={formAction}>
          <div className={classes.row}>
            <p>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" required />
            </p>
            <p>
              <label htmlFor="email">Your email</label>
              <input type="email" id="email" name="email" required />
            </p>
          </div>

          <p>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" required />
          </p>

          <p>
            <label htmlFor="summary">Short Summary</label>
            <input type="text" id="summary" name="summary" required />
          </p>

          <p>
            <label htmlFor="instructions">Instructions</label>
            <textarea
              id="instructions"
              name="instructions"
              rows={10}
              required
            ></textarea>
          </p>

          <ImagePicker
            label="Meal Image"
            name="image"
            onPick={(file) => setPickedImage(file)}
          />

          <p className={classes.actions}>
            <MealFormSubmit />
          </p>

          {state.message && (
            <p className={classes.message}>{state.message}</p>
          )}
        </form>
      </main>
    </>
  );
}
