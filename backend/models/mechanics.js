// models/Mechanic.js
module.exports = (sequelize, DataTypes) => {
    const Mechanic = sequelize.define('Mechanic', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // Store image path/URL
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      availableSlots: {
        type: DataTypes.JSON, // Store as array of strings ['09:00', '10:00']
        allowNull: false,
      }
    });
  
    Mechanic.associate = (models) => {
      Mechanic.hasMany(models.Appointment, { foreignKey: 'mechanicId' });
    };
  
    return Mechanic;
  };