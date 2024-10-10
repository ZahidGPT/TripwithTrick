const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  // ... existing fields
  groupType: {
    type: String,
    enum: ['all', 'male_only', 'female_only', 'couple_only'],
    default: 'all'
  }
});

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;