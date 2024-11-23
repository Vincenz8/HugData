"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class Article extends Model {};

Article.init(
  {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 20]
      }
    },
    pathImg: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    corpus: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [100, 2000]
      }
    }
  },
  {
    sequelize, 
    modelName: 'ARTICLE', 
  },
);

