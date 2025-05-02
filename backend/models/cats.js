module.exports = (sequelize, DataTypes) => {
    const Cat = sequelize.define('Cat', {
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
        type: DataTypes.STRING, 
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      availableSlots: {
        type: DataTypes.JSON, 
        allowNull: false,
      }
    });
  
    Cat.associate = (models) => {
      Cat.hasMany(models.Appointment, { foreignKey: 'catId' });
    };
  
    return Cat;
  };