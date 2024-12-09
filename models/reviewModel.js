const reviewSchema = new mongoose.Schema({
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Review', reviewSchema);
  