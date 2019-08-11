'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const StoreSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdBy: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  totalImportProduct: {
    type: Number,
    default: 0
  },
  productQuantity: {
    type: Number,
    default: 0
  },
  returnedQuantity: {
    type: Number,
    default: 0
  },
  debt: {
    type: Number,
    default: 0
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isRemoved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

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
      isDefault: this.isDefault
    };
  }
};

StoreSchema.statics = {
  createStore(args, userID) {
    return this.create(Object.assign({}, args, {
      createdBy: userID
    }));
  },
  list({ skip = 0, limit = 50, type, isDebt } = {}) {
    let queries = { isRemoved: false };
    if (isDebt) {
      queries = {
        isRemoved: false,
        debt: { $gt: 0 }
      };
    }
    return this.find(queries).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }
};

StoreSchema.index({ name: 'text' });

exports.default = _mongoose2.default.model('Store', StoreSchema);