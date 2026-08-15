function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;            // "data:application/pdf;base64,XXXX"
      resolve(result.split(",")[1]);           // keep only the base64 payload
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}