import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    store: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
    },
    importPrice: {
      type: Number,
      default: 0,
    },
    exportPrice: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      importPrice: this.importPrice,
      exportPrice: this.exportPrice,
      quantity: this.quantity,
      total: this.total,
      soldQuantity: this.total - this.quantity,
      store: this.store,
      capitalAmount: this.total * this.importPrice,
      soldAmount: (this.total - this.quantity) * this.exportPrice,
      isReturned: this.isReturned,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  },
};

ProductSchema.statics = {
  createProduct(args, userID) {
    return this.create({
      ...args,
      createdBy: userID,
    });
  },
  list({ skip = 0, limit = 50, store } = {}) {
    const queries = store ? { isRemoved: false, store } : { isRemoved: false };
    return this.find(queries)
      .populate('store')
      .sort({ exportPrice: 1 })
      .skip(skip)
      .limit(limit);
  },
};

export default mongoose.model('Product', ProductSchema);
