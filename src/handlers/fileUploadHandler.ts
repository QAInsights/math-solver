import React from "react";

export const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  if (file) {
    console.log("File uploaded:", file.name);
    const imageElement = document.getElementById("uploadedImage") as HTMLImageElement;
    if (imageElement) {
      imageElement.src = URL.createObjectURL(file);

      // convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64data = reader.result as string;
        // Store the base64 data in localStorage
        localStorage.setItem("uploadedImage", base64data);
      };

      reader.onerror = (error) => {
        console.log("Error:", error);
        console.log("Error code:", error.target?.error?.code);
      };
    }
  }
};
