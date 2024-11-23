"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class Augment extends Model {}

Augment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nOp:{
      type: DataTypes.SMALLINT
    },
    
    dataName: {
    type: DataTypes.TEXT,
    allowNull: false
    },
    pathAug: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    sequelize, 
    modelName: 'AUGMENT', 
  },
);

