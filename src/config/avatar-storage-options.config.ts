import { randomBytes } from 'crypto';
import { DiskStorageOptions } from 'multer';
import { extname } from 'path';

export const avatarStorageOptions: DiskStorageOptions = {
  destination: `${process.env.UPLOAD_PATH}/avatars`,
  filename(req, file, callback) {
    const fileExtension = extname(file.originalname);
    const userId = req.params.id;
    const randomString = randomBytes(16).toString('hex');
    const fileName = `${userId}-${randomString}${fileExtension}`;
    callback(null, fileName);
  },
};
