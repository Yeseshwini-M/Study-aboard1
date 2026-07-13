const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  date: { type: DataTypes.DATEONLY, allowNull: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: true },
  dob: { type: DataTypes.DATEONLY, allowNull: true },
  email: { type: DataTypes.STRING, allowNull: true },
  mobile: { type: DataTypes.STRING, allowNull: true },
  has_passport: { type: DataTypes.BOOLEAN, allowNull: true },
  passport_number: { type: DataTypes.STRING, allowNull: true },

  father_name: { type: DataTypes.STRING, allowNull: true },
  mother_name: { type: DataTypes.STRING, allowNull: true },
  father_occupation: { type: DataTypes.STRING, allowNull: true },
  mother_occupation: { type: DataTypes.STRING, allowNull: true },
  father_contact: { type: DataTypes.STRING, allowNull: true },
  mother_contact: { type: DataTypes.STRING, allowNull: true },

  sibling1_name: { type: DataTypes.STRING, allowNull: true },
  sibling1_edujob: { type: DataTypes.STRING, allowNull: true },
  sibling2_name: { type: DataTypes.STRING, allowNull: true },
  sibling2_edujob: { type: DataTypes.STRING, allowNull: true },

  family_annual_income: { type: DataTypes.STRING, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },

  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('qualifications');
      try { return raw ? JSON.parse(raw) : []; }
      catch { return []; }
    },
    set(val) {
      this.setDataValue('qualifications', JSON.stringify(val || []));
    },
  },

  english_test: { type: DataTypes.BOOLEAN, allowNull: true },
  english_test_marks: { type: DataTypes.STRING, allowNull: true },
  english_test_remarks: { type: DataTypes.STRING, allowNull: true },

  country_uk: { type: DataTypes.BOOLEAN, defaultValue: false },
  country_other: { type: DataTypes.STRING, allowNull: true },
  university_preferred: { type: DataTypes.STRING, allowNull: true },

  heard_friends: { type: DataTypes.BOOLEAN, defaultValue: false },
  heard_internet: { type: DataTypes.BOOLEAN, defaultValue: false },
  heard_tele_calling: { type: DataTypes.BOOLEAN, defaultValue: false },
  heard_brand_reference: { type: DataTypes.BOOLEAN, defaultValue: false },
  heard_mobile_sms: { type: DataTypes.BOOLEAN, defaultValue: false },
  heard_whatsapp: { type: DataTypes.BOOLEAN, defaultValue: false },

  ref1_name: { type: DataTypes.STRING, allowNull: true },
  ref1_contact: { type: DataTypes.STRING, allowNull: true },
  ref1_attended: { type: DataTypes.STRING, allowNull: true },
  ref1_signature: { type: DataTypes.STRING, allowNull: true },

  ref2_name: { type: DataTypes.STRING, allowNull: true },
  ref2_contact: { type: DataTypes.STRING, allowNull: true },
  ref2_attended: { type: DataTypes.STRING, allowNull: true },
  ref2_signature: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Submission;
