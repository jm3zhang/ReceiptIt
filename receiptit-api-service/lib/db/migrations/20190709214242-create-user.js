'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('users',
			{
				user_id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true,
					allowNull: false
				},
				password: {
					type: Sequelize.STRING,
					allowNull: false
				},
				email: {
					type: Sequelize.STRING,
					unique: true,
					allowNull: false
				},
				first_name: Sequelize.STRING,
				last_name: Sequelize.STRING,
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
		return queryInterface.dropTable('users');
	}
};
