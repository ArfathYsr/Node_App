import { z } from 'zod';
import { MESSAGES } from '../utils/message';

export const getNumberIdSchema = () =>
  z.string().transform((val) => {
    const num = Number(val);
    if (Number.isNaN(num)) {
      throw new Error('Invalid Id parameter');
    }
    return num;
  });

export const getDateSchema = () =>
  z
    .string()
    .datetime({ offset: true })
    .openapi({ example: '2024-08-23T00:00:00.000Z' });

export const getBase64SupportedFormatsSchema = () =>
  z
    .string()
    .regex(
      /^data:image\/(png|jpeg|jpg|gif|svg\+xml);base64,[a-zA-Z0-9+/]+={0,2}$/,
      'Invalid Base64 image format. Supported formats: png, jpeg, jpg, gif, svg.',
    );
export const validateMobilePhone = () =>
  z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, {
      message: MESSAGES.INVALID_PHONE_NO('Mobile Phone'),
    })
    .nullable();

export const validateBusinessPhone = () =>
  z
    .string({ message: MESSAGES.REQUIRED_FIELD('Business Phone') })
    .regex(/^\d{3}-\d{3}-\d{4}$/, {
      message: MESSAGES.INVALID_PHONE_NO('Business Phone'),
    })
    .nullable();
    

export const validateNameSchema = () =>
  z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(1, { message: 'String cannot be empty' })
    .max(255, { message: 'Must be 255 or fewer characters long' })
    .openapi({ example: 'testName' });

export const validateEmailSchema = () =>
  z
    .string()
    .email()
    .min(1, { message: MESSAGES.REQUIRED_FIELD('Email') })
    .max(255)
    .openapi({ example: 'abc@abc.com' });
export const validFaxNo = () =>
  z
    .string()
    .regex(/^\d{3}-\d{3}-\d{4}$/, {
      message: 'Please enter a valid fax number in the format 555-555-5555.',
    })
    .optional();

export const validPhoneNo = () =>
  z.string().regex(/^\d{3}-\d{3}-\d{4}$/, {
    message: 'Please enter a valid phone number in the format 555-555-5555.',
  });
