import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  Res,
  HttpStatus,
  HttpException,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDTO } from './account.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Multer } from 'multer';

@Controller('/account')
export class AccountController {
  constructor(private userService: UserService) {}

  @Get('')
  public async account(@Req() request): Promise<User> {
    const user: User = await this.userService.findOne(request.user.id);

    if (!user) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    if (user.password) {
      delete user.password;
    }

    return user;
  }

  @Put('/profile')
  @UseInterceptors(FileInterceptor('image'))
  public async updateProfile(
    @Body() body: UpdateProfileDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /(jpg|jpeg|png)$/ })
        .addMaxSizeValidator({
          maxSize: 1000 * 100 * 10 * 5,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
    @Req() request,
    @Res() response,
  ): Promise<Response | never> {
    try {
      body.image = image;
      const user = await this.userService.updateProfile(body, request.user);
      if (user.password) {
        delete user.password;
      }
      return response.status(HttpStatus.OK).send({ user, success: true });
    } catch (error) {
      throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
