import fs from "fs";
import * as oci from "oci-sdk";
import * as path from "path";
import { Readable } from "stream";
import { promisify } from "util";
import { pipeline as pipelineCallback } from "stream";

const pipeline = promisify(pipelineCallback);
const OBJECT_DOWNLOADED = "success_object_downloaded";

const provider = new oci.common.ConfigFileAuthenticationDetailsProvider();
const objectStorageClient = new oci.objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

const namespaceName = "sdeijlccaauz";
const bucketName = "emitest";
const objectName = "iscs_block.emi";
const filePath = "iscs_block.emi";

async function uploadObject() {
  try {
    const filestream = fs.createReadStream(filePath);
    const fileStats = fs.statSync(filePath);
    const uploadRequest = {
      namespaceName,
      bucketName,
      objectName,
      putObjectBody: filestream,
      contentLength: fileStats.size,
    };

    const response = await objectStorageClient.putObject(uploadRequest);
    console.log("SUCCESS", response);
  } catch (err: any) {
    console.error(err.message);
  }
}

async function listFilesInBucket(): Promise<string[]> {
  const objectList: string[] = [];
  let start = undefined;
  do {
    try {
      const listRequest = {
        namespaceName,
        bucketName,
        start,
      };
      const response = await objectStorageClient.listObjects(listRequest);

      if (response.listObjects.objects) {
        for (const obj of response.listObjects.objects) {
          objectList.push(`${obj.name}`);
        }
      }

      start = response.listObjects.nextStartWith;
    } catch (err: any) {
      console.error(err.message);
    }
  } while (start);

  return objectList;
}

async function downlaodFile(): Promise<void> {
  try {
    const downloadRequest = {
      namespaceName,
      bucketName,
      objectName,
    };
    const response = await objectStorageClient.getObject(downloadRequest);

    if (response.value instanceof require("stream").Readable) {
      const filePath = path.join(__dirname, `OCL-${objectName}`);
      const writeStream = fs.createWriteStream(filePath);
      const readableStream = response.value as Readable;
      await pipeline(readableStream, writeStream);
      console.log(OBJECT_DOWNLOADED);
    } else {
      console.error("FAILED stream type");
    }
  } catch (err: any) {
    console.error(err.message);
  }
}

//uploadObject();
listFilesInBucket()
  .then((success) => console.log(success))
  .catch((err) => console.error(err));

downlaodFile()
  .then((success) => console.log(success))
  .catch((err) => {
    console.log(err);
  });
