import HTTPStatus from "http-status";
import User from "./user.model";
import constants from "../../config/constants";

export const getUserList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const search = req.query.search;
  try {
    let list;
    const queries = !search ? {} : { $text: { $search: search } };
    if (search) {
      list = await User.find(queries, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit);
    } else {
      list = await User.find(queries)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    }
    const total = await User.count(queries);
    return res.status(HTTPStatus.OK).json({ list, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message || e);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message || e);
  }
};

export const createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username.length <= 5) {
      throw new Error("Min length is 6");
    }
    const checkDuplicate = await User.findOne({ username: req.body.username });
    if (checkDuplicate) {
      throw new Error("Duplicate user!");
    }
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toJSON());
  } catch (error) {
    console.log(error);
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message || e);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    console.log(user);
    if (!user) {
      throw new Error("Not found");
    }
    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });
    await user.save();
    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    if (!user) {
      throw new Error("Not found");
    }

    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message || e);
  }
};
