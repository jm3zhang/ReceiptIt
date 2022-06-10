'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('reports', [
			{
				report_id: 1,
				user_id: 1,
				start_date: new Date(),
				end_date: new Date()
			},
			{
				report_id: 2,
				user_id: 2,
				start_date: new Date(),
				end_date: new Date()
			}
		], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('reports', null, {});
	}
};
