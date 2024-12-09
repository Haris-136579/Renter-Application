const adminLogSchema = new mongoose.Schema({
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('AdminLog', adminLogSchema);
  