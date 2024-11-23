"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class User extends Model {}

User.init(
  {
    // Model attributes are defined here
    name: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull:false,
      validate:{
        len: [1, 20]
      }
    },
    email: {
        type: DataTypes.TEXT,
        primaryKey: true,
        validate:{
          isEmail: true,
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "No description",
        validate:{
          len: [1,60]
        }
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    creator: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    pathImg: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  },
  {
    sequelize, 
    modelName: 'USER', 
  },
);
