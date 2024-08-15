import dotenv from "dotenv";
dotenv.config();

export interface BucketParams {
  namespaceName: string;
  bucketName: string;
  objectName: string;
  filePath?: string;
}
console.log("process.env.NAMESPACENAME!", process.env.NAMESPACENAME);
export const bucketParams: BucketParams = {
  namespaceName: process.env.NAMESPACENAME!,
  bucketName: process.env.BUCKETNAME!,
  objectName: process.env.OBJECTNAME!,
  filePath: process.env.FILEPATH,
};
