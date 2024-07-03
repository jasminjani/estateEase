'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    queryInterface.bulkInsert('roles', [{
      id : 1,
      role: 'property',
      createdAt: new Date(),
      updatedAt : new Date(),
    },{
      id : 2,
      role: 'constructor',
      createdAt: new Date(),
      updatedAt : new Date(),
    },])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
