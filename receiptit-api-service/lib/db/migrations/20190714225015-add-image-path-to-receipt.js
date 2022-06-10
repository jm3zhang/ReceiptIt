'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'receipts',
				'image_name',
				Sequelize.STRING
			),
			queryInterface.addColumn(
				'receipts',
				'image_url',
				Sequelize.STRING
			)
		]);
	},

	down: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.removeColumn(
				'receipts',
				'image_name'
			),
			queryInterface.removeColumn(
				'receipts',
				'image_url'
			)
		]);
	}
};
