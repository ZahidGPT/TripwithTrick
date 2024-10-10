const mongoose = require('mongoose');
const Package = require('../models/Package');

async function updatePackages() {
  try {
    // Update this connection string with your actual MongoDB Atlas connection string
    await mongoose.connect('mongodb+srv://zahidansari:Zahid101201310@cluster0.yirvc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

    const result = await Package.updateMany(
      { groupType: { $exists: false } },
      { $set: { groupType: 'all' } }
    );

    console.log(`Updated ${result.nModified} packages`);
  } catch (error) {
    console.error('Error updating packages:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updatePackages();