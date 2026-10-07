import { faker } from '@faker-js/faker';

function onlyLettersAndDigits(str) {
  return str.replace(/[^a-z0-9]/gi, '').toLowerCase();
}

export function generateNewUserData(logger = null) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const user = {
    firstName,
    lastName,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.string.numeric(5),
    phoneNumber: faker.string.numeric(10),
    ssn: faker.string.numeric(9),
    username: `${onlyLettersAndDigits(firstName)}${onlyLettersAndDigits(lastName)}${faker.string.numeric(5)}`,
    password: faker.internet.password({ length: 12 }),
  };

  if (logger) {
    logger.debug(`Generated new user data: ${JSON.stringify(user)}`);
  }

  return user;
}
