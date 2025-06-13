import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { MESSAGES } from '../../utils/message';
import {
  getDateSchema,
  validateNameSchema,
  validateEmailSchema,
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';
import {
  EXAMPLE_DATE,
  ExampleStrings,
  ExampleValues,
  OFFSET,
  VendorSortSchemaEntities,
} from '../../utils/constants';

extendZodWithOpenApi(z);

const AddressSchema = z.object({
  addressTypeId: z.number().min(1, { message: 'Address Type is required' }),
  emailAddress: z
    .string()
    .email()
    .min(1, { message: MESSAGES.REQUIRED_FIELD('Email') })
    .max(255),
  address1: z.string().max(255).nonempty({ message: 'Address1 is required' }),
  address2: z.string().max(255).nonempty({ message: 'Address2 is required' }),
  cityId: z.number().min(1, { message: 'City is required' }),
  stateId: z.number().min(1, { message: 'State is required' }),
  countryId: z.number().min(1, { message: 'Country is required' }),
  phoneNumber: z
    .string({
      required_error: MESSAGES.REQUIRED_FIELD('Phone number'),
    })
    .min(10)
    .max(40)
    .openapi({ example: MESSAGES.VALID_PHONE_NO }),
  isPrimary: z.boolean(),
  zipCode: z.string().max(10).regex(/^\d+$/, 'Zip code must be numeric'),
});

export const AddressRequestSchema = z.object({
  addresses: z.array(AddressSchema),
});

const BaseContactDetailsSchema = z.object({
  contactTypeId: z.number(),
  name: validateNameSchema(),
  phoneNumber: z
    .string({
      required_error: 'Phone number is required',
    })
    .min(10, { message: 'Must be at least 10 characters long' })
    .max(40, { message: 'Must be 40 or fewer characters long' })
    .openapi({ example: '555-555-5555' }),
  isPrimary: z.boolean(),
  emailAddress: validateEmailSchema(),
});

export const VendorContactDetailsSchema = BaseContactDetailsSchema.extend({
  contactInfos: BaseContactDetailsSchema,
});

export const ContactDetailsSchema = BaseContactDetailsSchema;

// Define the schema for AddVendorBodyData
export const AddVendorRequestSchema = z.object({
  body: z.object({
    startDate: getDateSchema(),
    endDate: getDateSchema(),
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, { message: 'Name must not be empty' })
      .regex(/^[A-Za-z][A-Za-z\s-]*$/, {
        message: 'Name must contain only alphabets and spaces',
      }),
    vendorTypeId: z.number(),
    isAlsoCaterer: z.boolean(),
    statusId: z.number(),
    dba: z.string().max(250),
    websiteUrl: z
      .string()
      .url({ message: 'Invalid URL format' })
      .openapi({ example: 'https://google.com' }),
    facebookUrl: z
      .string()
      .url({ message: 'Invalid URL format' })
      .openapi({ example: 'https://facebook.com' }),
    instagramUrl: z
      .string()
      .url({ message: 'Invalid URL format' })
      .openapi({ example: 'https://instagram.com' }),
    addresses: z.array(AddressRequestSchema),
    contactInfos: z.array(VendorContactDetailsSchema).optional(),
    clientIds: z.array(z.number()).optional().nullable(),
    additionalInformation: z.string(),
  }),
});

export const AddVendorResponseSchema = z.object({
  id: z.number(),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }),
  name: z.string(),
  vendorType: z.number(),
  isAlsoCaterer: z.boolean(),
  statusId: z.number(),
  addresses: z.array(AddressSchema),
  contactInfo: z.object({
    vendorId: z.number(),
    contactTypeId: z.number(),
    name: z.string(),
    phoneNumber: z.string(),
    emailAddress: z
      .string()
      .email()
      .min(1, { message: MESSAGES.REQUIRED_FIELD('Email') })
      .max(255),
    createdAt: getDateSchema(),
    updatedAt: getDateSchema(),
  }),
  clientIds: z.array(z.number()),
  additionalInformation: z.string(),
  createdAt: getDateSchema(),
  updatedAt: getDateSchema(),
});

export const GetVendorRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

const ContactResponseSchema = z.object({
  id: z.number(),
  vendorId: z.number(),
  contactTypeId: z.number(),
  name: z.string(),
  phoneNumber: z.string(),
  emailAddress: z.string().email(),
  createdBy: z.number(),
  createdAt: getDateSchema(),
  updatedBy: z.number(),
  updatedAt: getDateSchema(),
});
const AddressResponseSchema = z.object({
  id: z.number(),
  vendorId: z.number(),
  addressTypeId: z.number(),
  address1: z.string(),
  address2: z.string(),
  cityId: z.number(),
  stateId: z.number(),
  countryId: z.number(),
  zipcode: z.string().nullable(),
  emailAddress: z.string().email(),
  phoneNumber: z.string(),
  isPrimary: z.boolean(),
  createdBy: z.number(),
  createdAt: getDateSchema(),
  updatedBy: z.number(),
  updatedAt: getDateSchema(),
});
const ClientSchema = z.object({
  id: z.number(),
  createdAt: getDateSchema(),
  createdBy: z.number(),
  updatedAt: getDateSchema(),
  updatedBy: z.number(),
  clientStatusId: z.number(),
  name: z.string(),
  parentClientId: z.number().nullable(),
  description: z.string().nullable(),
  currencyId: z.number(),
  languageId: z.number(),
  logo: z.string().url(),
  fieldDate: getDateSchema(),
  startDate: getDateSchema(),
  endDate: getDateSchema(),
  isActive: z.boolean(),
  archivedAt: getDateSchema().nullable(),
});

const ClientVendorSchema = z.object({
  id: z.number(),
  clientId: z.number(),
  vendorId: z.number(),
  relationshipStatus: z.string().nullable(),
  startDate: getDateSchema(),
  endDate: getDateSchema(),
  additionalNotes: z.string().nullable(),
  createdBy: z.number(),
  createdAt: getDateSchema(),
  updatedBy: z.number(),
  updatedAt: getDateSchema(),
  client: ClientSchema,
});
const profileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const GetVendorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  vendorTypeId: z.number(),
  isAlsoCaterer: z.boolean(),
  vendorStatusId: z.number(),
  startDate: getDateSchema(),
  endDate: getDateSchema(),
  additionalInformation: z.string(),
  dba: z.string(),
  websiteUrl: z.string(),
  facebookUrl: z.string(),
  instagramUrl: z.string(),
  createdBy: z.number(),
  createdAt: getDateSchema(),
  updatedBy: z.number(),
  updatedAt: getDateSchema(),
  addresses: z.array(AddressResponseSchema),
  contacts: z.array(ContactResponseSchema),
  clientVendors: z.array(ClientVendorSchema),
  createdByProfile: profileSchema,
  updatedByProfile: profileSchema,
});

export const VendorListRequestSchema = z.object({
  body: z.object({
    sortBy: getSortBySchema([
      VendorSortSchemaEntities.ID,
      VendorSortSchemaEntities.NAME,
      VendorSortSchemaEntities.TYPE,
      VendorSortSchemaEntities.CREATEDAT,
      VendorSortSchemaEntities.UPDATEDAT,
      VendorSortSchemaEntities.UPDATEDBYPROFILE,
    ]),
    offset: z.number().openapi({ example: ExampleValues.ZERO }),
    limit: z.number().max(100).openapi({ example: ExampleValues.TWENTY }),
    searchText: z
      .string()
      .optional()
      .or(z.literal(''))
      .openapi({ example: '' }),
    startDate: z
      .string()
      .datetime({ offset: OFFSET })
      .openapi({ example: EXAMPLE_DATE })
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: EXAMPLE_DATE })
      .optional(),
    filter: z
      .object({
        type: z.string().optional().openapi({ example: ExampleStrings.TYPE }),
        name: z.string().optional().openapi({ example: ExampleStrings.NAME }),
        status: z.array(
          z
            .number()
            .positive()
            .optional()
            .openapi({ example: ExampleValues.ONE }),
        ),
      })
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const AddressTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
});

const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const StateSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const CountrySchema = z.object({
  id: z.number(),
  name: z.string(),
});

const AddressListSchema = z.object({
  id: z.number(),
  vendorId: z.number(),
  addressType: AddressTypeSchema,
  city: CitySchema,
  state: StateSchema,
  country: CountrySchema,
  address1: z.string(),
  address2: z.string(),
  zipcode: z.string(),
  emailAddress: z.string().email(),
  phoneNumber: z.string(),
  isPrimary: z.boolean(),
  createdAt: z.string().datetime(),
  createdBy: z.number(),
  updatedAt: z.string().datetime(),
  updatedBy: z.number(),
});

const VendorTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string().datetime(),
  createdBy: z.number(),
  updatedAt: z.string().datetime(),
  updatedBy: z.number(),
});

const VendorStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const ProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

const VendorSchema = z.object({
  id: z.number(),
  name: z.string(),
  isAlsoCaterer: z.boolean(),
  vendorType: VendorTypeSchema,
  additionalInformation: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  dba: z.string(),
  websiteUrl: z.string().url(),
  facebookUrl: z.string().url(),
  instagramUrl: z.string().url(),
  addresses: z.array(AddressListSchema),
  vendorStatus: VendorStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdByProfile: ProfileSchema,
  updatedByProfile: ProfileSchema,
});

export const VendorListResponseSchema = z.object({
  vendorList: z.array(VendorSchema),
  totalAmount: z.number(),
  totalPages: z.number(),
  nextPage: z.boolean(),
});

export const VendorMatchListRequestSchema = z.object({
  body: z
    .object({
      filter: z.object({
        name: z.string().openapi({ example: '' }),
        addressLine1: z.string().optional().openapi({ example: '' }),
        city: z.string().optional().openapi({ example: '' }),
        state: z.string().optional().openapi({ example: '' }),
        zip: z.string().optional().openapi({ example: '' }),
      }),
      offset: z.number().openapi({ example: 0 }),
      limit: z.number().max(10).openapi({ example: 10 }),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const VendorMatchListResponseSchema = z.object({
  vendors: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      vendorType: z.string(),
      address1: z.string(),
      address2: z.string(),
      zipcode: z.string(),
      email: z.string(),
      phoneNumber: z.string(),
      city: z.string(),
      state: z.string(),
      countryName: z.string(),
      countryCode: z.string(),
      contactName: z.string(),
      contactType: z.string(),
      createdAt: getDateSchema(),
      updatedAt: getDateSchema(),
      createdByProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
      updatedByProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
      matchPercentage: z.number(),
    }),
  ),
  totalAmount: z.number(),
});

export const GetVendorMeetingRoomsRequestSchema = z.object({
  body: z
    .object({
      searchText: z.string().optional().openapi({ example: "Meeting Room" }),
      vendorId: z.number().openapi({ example: 123 }),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const VendorRoomDto = z.object({
  id: z.number().openapi({ example: 1 }),
  roomName: z.string().openapi({ example: "Conference Hall" }),
  maxCapacity: z.number().openapi({ example: 50 }),
  createdAt: z.string().openapi({ example: "2024-02-25T10:00:00Z" }), 
  createdBy: z.number().openapi({ example: 123 }),
});

export const GetVendorRoomDetailsResponseSchema = z.object({
  totalCount: z.number().openapi({ example: 100 }),
  vendorRoomdata: z.array(VendorRoomDto),
});
