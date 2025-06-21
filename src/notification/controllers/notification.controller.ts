import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UniversalJwtAuthGuard } from 'src/auth/guards/universal.jwt-auth.guard';
import { UniversalJwtRequest } from 'src/auth/types/universal.jwt-request';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { NotificationForbiddenException } from 'src/notification/exceptions/notification-forbidden.exception';
import { NotificationNotExistException } from 'src/notification/exceptions/notification-not-exist.exception';
import { NotificationService } from 'src/notification/services/notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Get notification by id',
    description:
      "User will receive empty object if he doesn't own the notification",
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse({
    type: NotificationEntity,
  })
  @Get(':id')
  async getNotificationById(
    @Param('id') notificationId: string,
    @Req() req: Request & { user: UniversalJwtRequest },
  ) {
    try {
      const notificationEntity =
        await this.notificationService.getNotificationById(
          notificationId,
          req.user.isAdmin || req.user.userId,
        );
      return notificationEntity;
    } catch (error) {
      if (error instanceof NotificationNotExistException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotificationForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(UniversalJwtAuthGuard)
  @ApiBearerAuth('admin')
  @ApiBearerAuth('user')
  @ApiOperation({
    summary: 'Mark notification as read by id',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse()
  @Get(':id/read')
  async markNotificationAsRead(
    @Param('id') notificationId: string,
    @Req() req: Request & { user: UniversalJwtRequest },
  ) {
    try {
      await this.notificationService.markNotificationAsReadById(
        notificationId,
        req.user.isAdmin || req.user.userId,
      );
    } catch (error) {
      if (error instanceof NotificationNotExistException) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof NotificationForbiddenException) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }
}
