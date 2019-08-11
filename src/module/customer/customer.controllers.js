import HTTPStatus from "http-status";
import Customer from './customer.model';
import constants from "../../config/constants";

export const getCustomerList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const search = req.query.search;
  const isDebt = req.query.isDebt;
  console.log(search);
  try {
    let list;
    let queries;
    if(isDebt) {
      queries = {  debt: {$gt: 0} };
    }
    else {
      queries = !search ? {} : { $text: { $search: search } };
    }
    if (search && search.length > 0) {
      list = await Customer.find(queries, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit);
    } else {
      list = await Customer.find(queries)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    }
    const total = await Customer.count(queries);
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message || e);
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    return res.status(HTTPStatus.OK).json(customer.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message || e);
  }
};

export const addCustomerDebt = async (req, res) => {
  try {

    // find customer
      const customer = await Customer.findOne({ _id: req.body.id });
    // if customer not exist -> create new customer and add debt
    if(!customer) {
      const result = await Customer.create(req.body);
       return res.status(HTTPStatus.CREATED).json(result.toJSON());
    }

    // if customer already exist
    customer.debt = req.body.debt >= 0 ? req.body.debt : 0;
    customer.username =req.body.username || customer.username;
    customer.phone = req.body.phone || customer.phone;
    customer.address = req.body.address || customer.address;

    await customer.save();
    return res.status(HTTPStatus.CREATED).json(customer.toJSON());
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message || e);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndRemove({ _id: req.params.id });
    if (!customer) {
      throw new Error("Not found");
    }

    return res.status(HTTPStatus.OK).json(customer.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
