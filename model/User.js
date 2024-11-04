// Import necessary modules
const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // Adjust the path as necessary

// Define the User model
const User = sequelize.define("User", {
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true, // Ensures a valid email format
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^[0-9]{10}$/, // Ensures a 10-digit phone number format
    },
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  interest: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array to hold multiple interests
    allowNull: true,
  },
  previousExperience: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expectations: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Array to hold multiple expectations
    allowNull: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: true, // Ensures the value is a float
      min: 0,        // Amount should be a positive number
    },
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Defaults to the current date and time
  },
}, {
  timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  tableName: "Users", // Optional: specify table name in the database
});

// Export the model
module.exports = User;
