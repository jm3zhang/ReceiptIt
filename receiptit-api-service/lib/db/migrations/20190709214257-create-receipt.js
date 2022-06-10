'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('receipts',
			{
				receipt_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false
				},
				user_id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					references: {
						model: "users",
						key: "user_id",
						as: "user_id"
					}
				},
				purchase_date: {
                    type: Sequelize.DATE,
                    allowNull: false
                },
                total_amount: {
                    type: Sequelize.DECIMAL(6, 2),
                    allowNull: false
                },
                merchant: Sequelize.STRING,
                postcode: Sequelize.STRING,
                comment: Sequelize.STRING,
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
		return queryInterface.dropTable('receipts');
	}
};
