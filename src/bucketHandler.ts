import fs from "fs";
import * as oci from "oci-sdk";
import * as path from "path";
import { Readable } from "stream";
import { promisify } from "util";
import { pipeline as pipelineCallback } from "stream";
import { BucketBlock, samplebucketParams } from "./model/BucketParams";
import { OBJECT_DOWNLOADED, OBJECT_UPLOADED, ERROR } from "./util/messages";
import dotenv from "dotenv";
import { ApplicationEnv } from "./model/Enviroments";
dotenv.config();
var isProd = false;

function getNodeEnv() {
  switch (process.env.NODE_ENV) {
    case ApplicationEnv.PROD:
      isProd = true;
      break;
    default:
      isProd = false;
  }
}

console.log("running env:", process.env.NODE_ENV);
export const pipeline = promisify(pipelineCallback);
const { namespaceName, bucketName, fileTransferList, read_dir } =
  samplebucketParams;

const provider = new oci.common.ConfigFileAuthenticationDetailsProvider();
const objectStorageClient = new oci.objectstorage.ObjectStorageClient({
  authenticationDetailsProvider: provider,
});

async function uploadObject(): Promise<void> {
  try {
    if (!fileTransferList[0].filePath)
      throw new Error(ERROR("filePath undefined"));

    const files = fs.readdirSync(read_dir);
    for (var file of files) {
      const fullPath = path.join(__dirname, "..", read_dir, file);
      console.log(fullPath);
      const filestream = fs.createReadStream(fullPath);
      const fileStats = fs.statSync(fullPath);

      const uploadRequest = {
        namespaceName,
        bucketName,
        objectName: file,
        putObjectBody: filestream,
        contentLength: fileStats.size,
      };

      const response = await objectStorageClient.putObject(uploadRequest);
      console.log(OBJECT_UPLOADED, response);
    }
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
      objectName: fileTransferList[0].objectName,
    };
    const response = await objectStorageClient.getObject(downloadRequest);

    const readableStream = response.value as Readable;
    console.log(readableStream);
    const filePath = path.join(
      __dirname,
      `${fileTransferList[0].objectName}.copy`
    );
    const writeStream = fs.createWriteStream(filePath);
    await pipeline(readableStream as any, writeStream);
    console.log(OBJECT_DOWNLOADED);
  } catch (err: any) {
    console.error(err.message);
  }
}

uploadObject()
  .then((success) => {
    listFilesInBucket()
      .then((success) => console.log(success))
      .catch((err) => console.error(err));

    downlaodFile()
      .then((success) => console.log(success))
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => console.error(err));
