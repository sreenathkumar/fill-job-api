import { DefaultAzureCredential } from "@azure/identity";
import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";


const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;

if (!accountName) throw Error('Azure Storage accountName not found');

// Create a BlobServiceClient object which will be used to create a container client
export const blobServiceClient = new BlobServiceClient(
   `https://${accountName}.blob.core.windows.net`,
   new DefaultAzureCredential()
);

export async function downloadBlob(containerClient: ContainerClient, blobName: string) {
   // Get a reference to the blob
   const blobClient = containerClient.getBlobClient(blobName);
   // Download the blob content as a buffer
   const response = await blobClient.downloadToBuffer();

   return response;
}
