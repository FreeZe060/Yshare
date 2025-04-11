const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbManager");

const ReportFile = sequelize.define("ReportFile", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  report_id: { type: DataTypes.INTEGER, allowNull: false },
  file_path: { type: DataTypes.TEXT, allowNull: false }
}, {
  tableName: "report_files",
  timestamps: false
});

module.exports = ReportFile;