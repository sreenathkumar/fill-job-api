import express from "express";
import { Stream } from "stream";
import fs from "fs";
import { blobServiceClient, downloadBlob } from "../utils/azure";
import { getFileExtension } from "../utils/others";

if (
  !process.env.AZURE_STORAGE_PHOTO_CONTAINER_NAME ||
  !process.env.AZURE_STORAGE_SIGNATURE_CONTAINER_NAME
) {
  throw Error("Azure Storage container name defined");
}
// ContainerClient in which the image will be stored
const photoContainerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_PHOTO_CONTAINER_NAME
);
const signatureContainerClient = blobServiceClient.getContainerClient(
  process.env.AZURE_STORAGE_SIGNATURE_CONTAINER_NAME
);

export const uploadImageController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const files = req.files as Express.Multer.File[];
    for (const file of files) {
      // Create readable stream from the file buffer
      const readableStream = new Stream.PassThrough();
      readableStream.end(file.buffer);

      //Upload the image to the container
      const blobName = `${req.body.id}_${file.fieldname}.${getFileExtension(
        file.originalname
      )}`;
      let uploadResponse; // will be checked if the image is uploaded successfully or not

      if (file.fieldname === "photo") {
        const blobClient = photoContainerClient.getBlockBlobClient(blobName);
        uploadResponse = await blobClient.uploadFile(file.path);
      } else if (file.fieldname === "signature") {
        const blobClient =
          signatureContainerClient.getBlockBlobClient(blobName);
        uploadResponse = await blobClient.uploadFile(file.path);
      }

      if (uploadResponse) {
        //Delete the image from the uploads folder
        fs.unlink(file.path, (unlinkError) => {
          if (unlinkError) {
            console.log(`Error deleting ${file.fieldname}: ${unlinkError}`);
          } else {
            console.log(`${file.fieldname} deleted successfully`);
          }
        });
      }
    }
    res.send({
      status: "success",
      message: `Images uploaded successfully to the blob storage`,
    });
  } catch (err) {
    res.send({ status: "error", error: `Error uploading image: ${err}` });
  }
};

export const getImageController = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.query as { id: string };
  if (!id) {
    throw Error("id not defined");
  }

  try {
    let photoResponse = null;
    let signatureResponse = null;

    try {
      photoResponse = await downloadBlob(
        photoContainerClient,
        `${id}_photo.jpg`
      );
    } catch (photoError: any) {
      console.log("Error downloading photo:", photoError?.details?.errorCode);
    }

    try {
      signatureResponse = await downloadBlob(
        signatureContainerClient,
        `${id}_signature.jpg`
      );
    } catch (signatureError: any) {
      console.log(
        "Error downloading signature:",
        signatureError?.details?.errorCode
      );
    }

    res.send({
      status: "success",
      photo: photoResponse ? photoResponse.toString("base64") : null,
      signature: signatureResponse
        ? signatureResponse.toString("base64")
        : null,
    });
  } catch (err) {
    res.send({ status: "error", error: `Error getting image: ${err}` });
  }
};
