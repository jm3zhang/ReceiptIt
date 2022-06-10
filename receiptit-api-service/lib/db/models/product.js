'use strict';

const Sequelize = require("sequelize");

class Product extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                product_id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                receipt_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: sequelize.model.Receipt,
                        key: "receipt_id",
                        as: "receipt_id"
                    }
                },
                name: DataTypes.STRING,
                description: DataTypes.STRING,
                quantity: DataTypes.INTEGER,
                currency_code: DataTypes.STRING(3),
                price: DataTypes.DECIMAL(6, 2)
            },
            {
                modelName: "product",
                sequelize
            }
        );
    };


    static associate(models) {
        this.belongsTo(models.Receipt, {
            foreignKey: "receipt_id",
            targetKey: "receipt_id"
        });
    };
};

module.exports = Product;