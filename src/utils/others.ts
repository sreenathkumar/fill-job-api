export function getFileExtension(filename: string) {
   // Get file extension
   const fileExtension = filename.split('.').pop();
   return fileExtension;
}

