'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('products',
			{
				product_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false
				},
				receipt_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "receipts",
						key: "receipt_id",
						as: "receipt_id"
					},
					onDelete: 'cascade'
				},
				name: Sequelize.STRING,
				description: Sequelize.STRING,
				quantity: Sequelize.INTEGER,
				currency_code: Sequelize.STRING(3),
				price: Sequelize.DECIMAL(6, 2),
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: new Date()
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
					defaultValue: new Date()
				}
			}
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('products');
	}
};
