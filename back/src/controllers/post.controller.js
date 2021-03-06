import postTable from "../databases/postTable";
import models from "../models";
import httpStatus from "http-status";
import createError from "http-errors";

const getPostList = async (req, res, next) => {
  let transaction = null;
  try {
    transaction = await models.sequelize.transaction();
    const Post = new postTable();
    //TODO
    //const { page, limit, category } = req.query
    const { subject } = req.query;
    const condition = {
      isDeleted: false,
    };
    if (subject !== "all") {
      condition.subject = subject;
    }
    const postList = await Post.getPostList(condition);
    await transaction.commit();
    return res.status(200).json({ message: "ok", result: postList });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const createPost = async (req, res, next) => {
  let transaction = null;
  try {
    transaction = await models.sequelize.transaction();
    const Post = new postTable();
    const { title, contents, subject } = req.body;
    if (title === undefined || contents === undefined || subject === undefined)
      throw createError(httpStatus.BAD_REQUEST, "INVALID PARAMETER");

    await Post.store({ title, contents, subject });
    await transaction.commit();
    return res.status(201).json({ message: "ok" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const getPost = async (req, res, next) => {
  let transaction = null;
  try {
    transaction = await models.sequelize.transaction();
    const Post = new postTable();
    const { postId } = req.params;
    console.log(postId);
    const postContents = await Post.getPost(postId);
    if (postContents === null)
      throw createError(httpStatus.BAD_REQUEST, "INVALID POST ID");
    await transaction.commit();
    return res.status(200).json({ message: "ok", result: postContents });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const modifyPost = async (req, res, next) => {
  let transaction = null;
  try {
    transaction = await models.sequelize.transaction();
    const Post = new postTable();
    const { postId } = req.params;
    const { title, contents, subject } = req.body;
    if (title === undefined || contents === undefined || subject === undefined)
      throw createError(httpStatus.BAD_REQUEST, "INVALID PARAMETER");
    await Post.modifyPost(postId, { title, contents, subject });
    await transaction.commit();
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  let transaction = null;
  try {
    transaction = await models.sequelize.transaction();
    const Post = new postTable();
    const { postId } = req.params;
    console.log(postId);
    await Post.deletePost(postId);
    await transaction.commit();
    return res.status(200).json({ message: "ok" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

export { getPostList, getPost, createPost, modifyPost, deletePost };
