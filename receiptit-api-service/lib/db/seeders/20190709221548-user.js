'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('users', [
			{
				user_id: 1,
				first_name: "David",
				last_name: "Zhang",
				password: '9ff7b641722c30acdc058f2499d97dd8',
				email: "test1@test1.com"
			},
			{
				user_id: 2,
				first_name: "Ziyan",
				last_name: "Liu",
				password: '082b66a712e3efe31385f3158e057496',
				email: "test2@test2.com"
			}
		], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('users', null, {});
	}
};
