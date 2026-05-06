import { faker } from '@faker-js/faker';

export const userData = () => ({
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  zipcode: faker.address.zipCode()
});