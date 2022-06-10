'use strict';

const Sequelize = require("sequelize");

class Report extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                report_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                user_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: sequelize.model.User,
                        key: "user_id",
                        as: "receipt_id"
                    }
                },
                start_date: DataTypes.DATE,
                end_date: DataTypes.DATE
            },
            {
                modelName: "report",
                sequelize
            }
        );
    };


    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: "user_id",
            targetKey: "user_id"
        });
    };
};

module.exports = Report;