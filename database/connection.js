"use strict"

import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database/datab.sqlite",
    foreignKeys: true,
    define: {
        timestamps: false,
        freezeTableName: true
    }
});

try {
    const fn = async () => await sequelize.authenticate();
    fn()
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;