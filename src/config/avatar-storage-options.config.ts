import { randomBytes } from 'crypto';
import { DiskStorageOptions } from 'multer';
import { extname, join as joinPath } from 'path';

export const avatarStorageOptions: DiskStorageOptions = {
  destination: joinPath(process.cwd(), `${process.env.UPLOAD_PATH}/avatars`),
  filename(req, file, callback) {
    const fileExtension = extname(file.originalname);
    const userId = req.params.id;
    const randomString = randomBytes(16).toString('hex');
    const fileName = `${randomString}-${userId}${fileExtension}`;
    callback(null, fileName);
  },
};
