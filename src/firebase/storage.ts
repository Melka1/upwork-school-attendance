import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from ".";

interface UploadImageProps {
  file: File | null;
}

export const uploadImage = async ({ file }: UploadImageProps) => {
  if (!file) return "";
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error: Error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.log(error);
    return "";
  }
};
