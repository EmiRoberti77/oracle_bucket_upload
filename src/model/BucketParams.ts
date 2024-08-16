import dotenv from "dotenv";
dotenv.config();

export interface BucketBlock {
  objectName: string;
  filePath: string;
}

export const filesTransferList: BucketBlock[] = [];

export interface BucketParams {
  namespaceName: string;
  bucketName: string;
  read_dir: string;
  fileTransferList: BucketBlock[];
}
export const samplebucketParams: BucketParams = {
  namespaceName: process.env.NAMESPACENAME!,
  bucketName: process.env.BUCKETNAME!,
  read_dir: process.env.READ_DIR!,
  fileTransferList: [
    {
      objectName: process.env.OBJECTNAME!,
      filePath: process.env.FILEPATH!,
    },
  ],
};
