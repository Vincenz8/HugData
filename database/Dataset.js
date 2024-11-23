"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class Dataset extends Model {}

Dataset.init(
  {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    pathData: {
        type: DataTypes.TEXT,
        allowNull: false
      },

    pathImg: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "No description",
      validate: {
        len: [1, 150]
      }
    },
  },
  {
    sequelize, 
    modelName: 'DATASET',
  },
);
