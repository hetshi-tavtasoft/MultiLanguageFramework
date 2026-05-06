const { faker } = require('@faker-js/faker');

const userData = () => ({
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    zipcode: faker.address.zipCode()
});

module.exports = { userData };