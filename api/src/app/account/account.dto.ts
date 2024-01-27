import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsImageFile(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(mimeType) {
          const acceptMimeTypes = [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/gif',
          ];
          const fileType = acceptMimeTypes.find((type) => type === mimeType);
          return !fileType;
        },
      },
    });
  };
}

// DTOs
export class UpdateProfileDTO {
  @IsImageFile({ message: 'invalid mime type received' })
  public image: any;
}
