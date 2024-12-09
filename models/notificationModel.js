const notificationSchema = new mongoose.Schema({
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  module.exports = mongoose.model('Notification', notificationSchema);
  