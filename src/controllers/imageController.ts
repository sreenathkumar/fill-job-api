import express from 'express';
import { Stream } from 'stream';
import fs from 'fs';
import { blobServiceClient, downloadBlob } from '../utils/azure';


if (!process.env.AZURE_STORAGE_PHOTO_CONTAINER_NAME || !process.env.AZURE_STORAGE_SIGNATURE_CONTAINER_NAME) {
   throw Error('Azure Storage container name defined');
}
// ContainerClient in which the image will be stored
const photoContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_PHOTO_CONTAINER_NAME);
const signatureContainerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_SIGNATURE_CONTAINER_NAME);

export const uploadImageController = async (req: express.Request, res: express.Response) => {
   try {
      const files = req.files as Express.Multer.File[];
      for (const file of files) {
         // Create readable stream from the file buffer
         const readableStream = new Stream.PassThrough();
         readableStream.end(file.buffer);

         //Upload the image to the container
         const blobName = `${req.body.id}_${file.fieldname}`;
         if (file.fieldname === 'photo') {
            const blobClient = photoContainerClient.getBlockBlobClient(blobName);
            const uploadResponse = await blobClient.uploadStream(readableStream, file.size, 4, {
               blobHTTPHeaders: { blobContentType: file.mimetype }
            });
         } else if (file.fieldname === 'signature') {
            const blobClient = signatureContainerClient.getBlockBlobClient(blobName);
            const uploadResponse = await blobClient.uploadStream(readableStream, file.size, 4, {
               blobHTTPHeaders: { blobContentType: file.mimetype }
            });
         }

         console.log(`${file.originalname} uploaded successfully to the blob storage`);

         //Delete the image from the uploads folder
         fs.unlink(file.path, (unlinkError) => {
            if (unlinkError) {
               console.log(`Error deleting image: ${unlinkError}`)
            } else {
               console.log(`Image deleted successfully`)
            }
         });

         res.send({ status: 'success', message: `Image uploaded successfully to the blob storage` });
      }

   } catch (err) {
      res.send({ status: 'error', error: `Error uploading image: ${err}` });
   }
}

export const getImageController = async (req: express.Request, res: express.Response) => {
   const { name, } = req.body;
   try {
      const photoResponse = await downloadBlob(photoContainerClient, name);// get the image from the container
      const signatureResponse = await downloadBlob(signatureContainerClient, name); // get the signature from the container
      console.log(photoResponse);

      //res.send({ status: 'success', photo: photoResponse, signature: signatureResponse });
   } catch (err) {
      console.log(`Error getting image: ${err}`);

      res.send({ status: 'error', error: `Error getting image: ${err}` });
   }
}