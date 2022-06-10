'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('reports',
			{
				report_id: {
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
						as: "receipt_id"
					}
				},
				start_date: Sequelize.DATE,
				end_date: Sequelize.DATE,
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
		return queryInterface.dropTable('reports');
	}
};
