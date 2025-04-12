import { DiskStorageOptions } from 'multer';
import { extname } from 'path';
import { UserService } from 'src/user/services/user.service';

export const avatarStorageOptions: DiskStorageOptions = {
  destination: `${process.env.UPLOAD_PATH}/avatars`,
  filename(req, file, callback) {
    const fileExtension = extname(file.originalname);
    const userId = req.params.id;
    // NOTE: This storage option doesn't provide hook so... I put the cleanup avatar in here. Also it's async but this function doesn't support async fuck you
    void UserService.deleteAvatarInStorage(userId);
    const fileName = `${userId}${fileExtension}`;
    callback(null, fileName);
  },
};
