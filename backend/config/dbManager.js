const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'postgres',
  process.env.DB_USER || 'postgres.oyftkvkglphklmijwbsn',
  process.env.DB_PASSWORD || "Alex110804@'@",
  {
    host: process.env.DB_HOST || 'aws-0-eu-west-3.pooler.supabase.com',
    port: process.env.DB_PORT || 6543,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false 
      }
    },
    logging: false,
  }
);

module.exports = sequelize;