import { IsString } from 'class-validator';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsValidFile(options?: ValidationOptions) {
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
            'application/pdf',
          ];
          const fileType = acceptMimeTypes.find((type) => type === mimeType);
          return !fileType;
        },
      },
    });
  };
}

// DTOs
export class CreatePatientFileDto {
  @IsValidFile({ message: 'invalid file type received' })
  public file: any;

  @IsString()
  public readonly note: string;
}
