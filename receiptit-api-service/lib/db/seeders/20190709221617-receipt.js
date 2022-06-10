'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('receipts', [
			{
				receipt_id: 1,
				user_id: 1,
				purchase_date: new Date(),
				total_amount: 66.66,
				merchant: "Costco",
				postcode: "N2J 3Z4",
				comment: "test1"
			},
			{
				receipt_id: 2,
				user_id: 2,
				purchase_date: new Date(),
				total_amount: 66.66,
				merchant: "Walmart",
				postcode: "N2J 2J9",
				comment: "test2"
			}
		], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('receipts', null, {});
	}
};
