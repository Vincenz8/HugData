"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class Category extends Model {}

Category.init(
  {
    name: {
      type: DataTypes.TEXT,
      primaryKey: true, 
      validate:{
        len: [1,20]
      }
    },
  },
  {
    sequelize, 
    modelName: 'CATEGORY', 
  },
);
