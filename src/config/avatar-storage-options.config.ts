import { DiskStorageOptions } from 'multer';
import { extname } from 'path';

export const avatarStorageOptions: DiskStorageOptions = {
  destination: process.env.AVATARS_UPLOAD_PATH,
  filename(req, file, callback) {
    const fileExtension = extname(file.originalname);
    const userId = req.params.id;
    const fileName = `${userId}${fileExtension}`;
    callback(null, fileName);
  },
};
