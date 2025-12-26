'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import classes from './image-picker.module.css';

interface ImagePickerProps {
  label: string;
  name: string;
  onPick?: (file: File) => void; // optional callback
}

export default function ImagePicker({ label, name, onPick }: ImagePickerProps) {
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const imageInput = useRef<HTMLInputElement | null>(null);

  function handlePickClick() {
    imageInput.current?.click();
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const pickedFile = e.target.files?.[0];
    if (!pickedFile) {
      setPickedImage(null);
      setFile(null);
      return;
    }

    setFile(pickedFile); // store actual File
    onPick?.(pickedFile); // notify parent if needed

    const reader = new FileReader();
    reader.onload = () => {
      setPickedImage(reader.result as string); // store data URL for preview
    };
    reader.readAsDataURL(pickedFile);
  }

  return (
    <div className={classes.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={classes.controls}>
        <div className={classes.preview}>
          {!pickedImage && <p>No image picked yet.</p>}
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="Selected image"
              fill
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>

        <input
          type="file"
          id={name}
          name={name}
          accept="image/png, image/jpeg"
          ref={imageInput}
          className={classes.input}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={classes.button}
          onClick={handlePickClick}
        >
          Pick an Image
        </button>
      </div>
    </div>
  );
}
