"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class Love extends Model {};

Love.init(
  {
    USEREmail: {
        type: DataTypes.TEXT,
        primaryKey: true
    },

    ARTICLEId: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
  },
  {
    
    sequelize, 
    modelName: 'LOVE',
  },
);