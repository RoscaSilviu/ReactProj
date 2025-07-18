  module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      catId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Cats',
          key: 'id',
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carBrand: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      carModel: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    Appointment.associate = (models) => {
      Appointment.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      Appointment.belongsTo(models.Cat, { foreignKey: 'catId' });
    };

    return Appointment;
  };