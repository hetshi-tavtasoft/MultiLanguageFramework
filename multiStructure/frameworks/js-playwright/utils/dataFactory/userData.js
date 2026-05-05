const { faker } = require('@faker-js/faker');

const userData = () => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    zipcode: faker.location.zipCode()
});

module.exports = { userData };