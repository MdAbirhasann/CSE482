import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600
    },
    contact: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
      minlength: 10,
      maxlength: 1500
    },
    itemType: {
      type: String,
      enum: ['lost', 'found'],
      required: true
    },
    category: {
      type: String,
      enum: ['Documents', 'Electronics', 'Wallet', 'Bag', 'Keys', 'ID Card', 'Pet', 'Other'],
      default: 'Other'
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    area: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    locationText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40
    },
    dateHappened: {
      type: Date,
      required: true
    },
    reward: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['open', 'matched', 'closed'],
      default: 'open'
    },
    geo: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null }
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    claims: [claimSchema]
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', city: 'text', area: 'text', locationText: 'text' });
itemSchema.index({ itemType: 1, category: 1, city: 1, status: 1 });

export default mongoose.model('Item', itemSchema);
