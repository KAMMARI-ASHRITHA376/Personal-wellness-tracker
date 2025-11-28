const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, 
  journals: [{ 
    date: { type: String, required: true }, 
    text: String, 
    mood: { type: String, enum: ['Happy', 'Sad', 'Calm', 'Anxious', 'Angry', 'Neutral'] }
  }],
  
  cycle: { 
    lastPeriodDate: Date,
    cycleLength: { type: Number, default: 28 }
  }
});

module.exports = mongoose.model('User', UserSchema);