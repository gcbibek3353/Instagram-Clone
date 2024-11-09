
// Extend the Request interface to include a custom `id` property
export interface CustomRequest extends Request {
    id?: string;
    body : any;     // Wrong approach but using temporarily
    params : any;   // Wrong approach but using temporarily
    // file?: any;
    file?: Express.Multer.File;
    files?:Express.Multer.File[]; // Assuming you're using Multer for file uploads
}


