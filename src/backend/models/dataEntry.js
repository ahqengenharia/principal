const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DataEntry = sequelize.define('DataEntry', {
    codigoANA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estacaoTelemetrica: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipoDados: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filetype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return DataEntry;
};