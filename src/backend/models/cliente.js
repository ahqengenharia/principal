const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    razaoSocial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logotipo: {
      type: DataTypes.STRING, // URL do logotipo
      allowNull: true
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    municipio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    responsavelTecnico: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigoANA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailContato: {
      type: DataTypes.STRING,
      allowNull: false
    },
    celularContato: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codigoCliente: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    numeroContrato: {
      type: DataTypes.STRING,
      allowNull: false
    },
    coordenadaX: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false
    },
    coordenadaY: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false
    },
    coordenadaZ: {
      type: DataTypes.DECIMAL(10, 6),
      allowNull: false
    },
    referencialCoordenadas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cloudInstanceUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Cliente;
};