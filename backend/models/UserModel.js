const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbManager');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Utilisateur'
    },
    profile_supabase_path: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    banner_supabase_path: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profileImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'profile_image'
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    street: {
        type: DataTypes.STRING,
        allowNull: true
    },
    streetNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'street_number'
    },
    bannerImage: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'banner_image'
    },
    status: {
        type: DataTypes.ENUM('Approved', 'Suspended'),
        defaultValue: 'Approved'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    showEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_email'
    },
    showAddress: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_address'
    },
    showPhone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'show_phone'
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('Homme', 'Femme', 'Autre', 'Préféré ne pas dire'),
        allowNull: true
    },
    linkedinUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'linkedin_url'
    },
    instaUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'insta_url'
    },
    websiteUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'website_url'
    }

}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = User;