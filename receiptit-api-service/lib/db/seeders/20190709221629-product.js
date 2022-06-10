'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('products', [
			{
				product_id: 1,
				receipt_id: 1,
				name: "Apple",
				description: "Test_Description",
				quantity: 5,
				currency_code: "USD",
				price: 10.03
			},
			{
				product_id: 2,
				receipt_id: 2,
				name: "Peach",
				description: "Test_Description",
				quantity: 5,
				currency_code: "USD",
				price: 10.20
			}
		], {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('products', null, {});
	}
};
