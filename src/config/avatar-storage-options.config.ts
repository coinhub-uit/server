import { DiskStorageOptions } from 'multer';

export const avatarStorageOptions: DiskStorageOptions = {
  destination: process.env.AVATARS_UPLOAD_PATH,
  filename(req, file, callback) {
    const userId = req.params.id;
    const fileName = `${userId}-avatar`;
    callback(null, fileName);
  },
};
