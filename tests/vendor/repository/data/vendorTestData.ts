import { AddVendorBodyData, AddVendorResponse } from '../../../../src/vendor/dto/vendor.dto';

export const mockData: AddVendorBodyData = {
  name: 'Test Vendor',
  vendorTypeId: 1,
  isAlsoCaterer: true,
  startDate: new Date(),
  endDate: new Date(),
  additionalInformation: 'Test Information',
  createdBy: 1,
  updatedBy: 1,
  clientIds: [1, 2],
  addresses: [
    {
      addresses: [
        {
          addressTypeId: 1,
          address1: '123 Test St',
          address2: 'Apt 1',
          cityId: 1,
          stateId: 1,
          zipcode: '12345',
          countryId: 1,
          phoneNumber: '123-456-7890',
          emailAddress: 'test@example.com',
          isPrimary: true,
        },
      ],
      createdBy: 1,
      updatedBy: 1,
      vendorId: 1,
    },
  ],
  dba: null,
  websiteUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  vendorStatusId: 0,
  contactInfos: [],
};

export const mockResponse: AddVendorResponse = {
  id: 1,
  startDate: new Date(),
  endDate: new Date(),
  name: 'Test Vendor',
  vendorTypeId: 1,
  isAlsoCaterer: true,
  vendorStatusId: 1,
  addresses: [],
  contactInfos: [],
  clientIds: [1, 2],
  additionalInformation: 'Test Information',
  createdBy: 1,
  updatedBy: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};
