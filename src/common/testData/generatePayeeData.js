import { faker } from '@faker-js/faker';

export function generatePayeeData() {
  return {
    payeeName: `${faker.person.firstName()} ${faker.person.lastName()}`,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.string.numeric(5),
    phoneNumber: faker.string.numeric(10),
    accountNumber: faker.string.numeric(8),
  };
}
