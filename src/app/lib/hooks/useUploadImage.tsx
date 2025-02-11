import { Dispatch, SetStateAction, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/firebase";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "../hooks";
import { setMessageAlert } from "../feature/pageSlice";

interface UploadImageProps {
  file: File;
}

interface UseUploadImageReturn {
  uploadImage: (file: File) => Promise<string>;
  loading: boolean;
  error: string | null;
  progress: number;
  setError: Dispatch<SetStateAction<string>>;
}

export const useUploadImage = (): UseUploadImageReturn => {
  const t = useTranslations("dashboard");
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File): Promise<string> => {
    if (!file) return "";
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const uploadProgress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(uploadProgress);
            console.log(`Upload is ${uploadProgress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            setError(t("errorOccurredWhileUploadingImage"));
            setLoading(false);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
            setLoading(false);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.log(error);
      setError("errorOccurredWhileUploadingImage");
      dispatch(
        setMessageAlert({
          message: t("errorOccurredWhileUploadingImage"),
          alertType: "error",
        })
      );
      setLoading(false);
      return "";
    }
  };

  return { uploadImage, loading, error, progress, setError };
};
