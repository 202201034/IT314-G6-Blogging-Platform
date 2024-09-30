import { Storage } from '@google-cloud/storage'; // Or use a different storage service
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const storage = new Storage(); // Initialize your storage service
const bucket = storage.bucket('your-bucket-name');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), '/public/uploads'); // Temporary upload directory
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to parse form data' });
      return;
    }

    try {
      const file = files.file[0];
      const filePath = file.filepath;
      const fileName = file.originalFilename;

      // Upload to storage
      await bucket.upload(filePath, {
        destination: `uploads/${fileName}`,
      });

      // Construct file URL
      const fileUrl = `https://storage.googleapis.com/your-bucket-name/uploads/${fileName}`;

      // Clean up local file
      fs.unlinkSync(filePath);

      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });
}
