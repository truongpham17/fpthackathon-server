'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _shortid = require('shortid');

var _shortid2 = _interopRequireDefault(_shortid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BillSchema = new _mongoose.Schema({
  _id: {
    type: String,
    default: _shortid2.default.generate
  },
  totalQuantity: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    default: 0
  },
  totalPaid: {
    type: Number,
    default: 0
  },
  otherCost: {
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
    },
    discount: {
      type: Number,
      default: 0
    },
    isReturned: {
      type: Boolean,
      default: false
    }
  }],
  customer: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  isReturned: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isRemoved: {
    type: Boolean,
    default: false
  },
  currentDebt: {
    type: Number,
    default: 0
  },
  paidMoney: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

BillSchema.pre('save', function (next) {
  if (this.isNew) {
    billModel.count().then(res => {
      this._id = res.toString().padStart(5, "0");
      next();
    });
  } else {
    next();
  }
});

BillSchema.methods = {
  toDetailJSON() {
    return {
      _id: this._id,
      totalQuantity: this.totalQuantity,
      totalPrice: this.totalPrice,
      totalPaid: this.totalPaid,
      otherCost: this.otherCost,
      note: this.note,
      productList: this.productList,
      customer: this.customer,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
      paymentStatus: this.totalPaid >= this.totalPrice + this.otherCost ? 'paid' : 'indebted',
      currentDebt: this.currentDebt
    };
  },
  toJSON() {
    return {
      _id: this._id,
      totalPrice: this.totalPrice,
      otherCost: this.otherCost,
      createdAt: this.createdAt,
      paymentStatus: this.totalPaid >= this.totalPrice + this.otherCost ? 'paid' : 'indebted',
      isReturned: this.isReturned
    };
  }
};

BillSchema.statics = {
  createBill(args, userID) {
    return this.create(Object.assign({}, args, {
      createdBy: userID
    }));
  },
  //'customer.name': new RegExp(customer, 'i')
  //

  // test here
  list({ skip = 0, limit = 50, search, customer } = {}) {
    const queries = {
      isRemoved: false,
      // isReturned,
      _id: new RegExp(search, 'i')
    };
    return this.find(queries)
    // .populate('productList.product productList.product.store')
    .populate({
      path: 'productList.product',
      populate: {
        path: 'store'
      }
    }).sort({ createdAt: -1 }).skip(skip).limit(limit);
  }
};

const billModel = _mongoose2.default.model('Bill', BillSchema);

BillSchema.index({ _id: 'text', 'customer.name': 'text' });

exports.default = billModel;