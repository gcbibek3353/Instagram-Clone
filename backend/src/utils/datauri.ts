import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

interface File {
    originalname: string;
    buffer: Buffer;
  }

//You need to define the correct types for the file argument, which in this case is an object that comes from file uploads, typically using a library like Multer in Express.
const getDataUri = (file : File) => {  
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer).content;
};
export default getDataUri;