import mongoose, { Schema } from 'mongoose';

const StoreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    totalImportProduct: {
      type: Number,
      default: 0,
    },
    productQuantity: {
      type: Number,
      default: 0,
    },
    returnedQuantity: {
      type: Number,
      default: 0,
    },
    debt: {
      type: Number,
      default: 0,
    },
    isDefault: {
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

StoreSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      totalImportProduct: this.totalImportProduct,
      productQuantity: this.productQuantity,
      returnedQuantity: this.returnedQuantity,
      debt: this.debt,
      isDefault: this.isDefault,
    };
  },
};

StoreSchema.statics = {
  createStore(args, userID) {
    return this.create({
      ...args,
      createdBy: userID,
    });
  },
  list({ skip = 0, limit = 50, type, isDebt } = {}) {
    let queries = {isRemoved: false}
    if(isDebt) {
      queries = {
        isRemoved: false,
        debt: {$gt: 0}
      }

    }
    return this.find(queries)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },
};

StoreSchema.index({ name: 'text' });

export default mongoose.model('Store', StoreSchema);
