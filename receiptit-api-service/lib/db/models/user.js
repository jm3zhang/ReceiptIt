'use strict';

const Sequelize = require("sequelize");

class User extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    unique: true,
                    allowNull: false
                },
                first_name: DataTypes.STRING,
                last_name: DataTypes.STRING,
            },
            {
                modelName: "user",
                sequelize
            }
        );
    };

    static associate(models) {
        this.hasMany(models.Receipt, {
            foreignKey: "user_id",
            sourceKey: "user_id"
        });

        this.hasMany(models.Report, {
            foreignKey: "user_id",
            sourceKey: "user_id"
        });
    };
};

module.exports = User;