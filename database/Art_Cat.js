"use strict";

import {DataTypes, Model } from 'sequelize';
import sequelize from"./connection.js";

export default class ArtCat extends Model {};

ArtCat.init(
  {
    ARTICLEId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    CATEGORYName: {
        type: DataTypes.TEXT,
        primaryKey: true,
        validate:{
          len: [1,20]
        }
    },
  },
  {
    sequelize, 
    modelName: 'ART_CAT',
  },
);

