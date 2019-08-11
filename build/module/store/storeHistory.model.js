'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const StoreHistorySchema = new _mongoose.Schema({
  store: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  quantity: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  note: {
    type: String
  },
  productList: [{
    product: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 0
    }
  }],
  isRemoved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

StoreHistorySchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      store: this.store,
      quantity: this.quantity,
      total: this.total,
      totalPrice: this.totalPrice,
      note: this.note,
      productList: this.productList,
      date: this.createdAt
    };
  }
};

StoreHistorySchema.statics = {
  createStoreHistory(args, userID) {
    return this.create(Object.assign({}, args, {
      createdBy: userID
    }));
  },
  list({ skip = 0, limit = 50, store } = {}) {
    const queries = store ? { store, isRemoved: false } : { isRemoved: false };
    return this.find(queries).populate('productList.product').sort({ createdAt: -1 }).skip(skip).limit(limit);
  }
};

StoreHistorySchema.index({ name: 'text' });

exports.default = _mongoose2.default.model('StoreHistory', StoreHistorySchema);