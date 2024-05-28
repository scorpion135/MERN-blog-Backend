import CommentModel from "../models/Comment.js";

export const getLastComments = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .limit(5)
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate("user").exec();

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    // const user = await UserModel.findOne({ _id: req.iserId });
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.id,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось добавить комментарий",
    });
  }
};

export const getOnePostComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await CommentModel.find({ post: postId })
      .populate("user")
      .exec();

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить комментарии",
    });
  }
};

export const deletePostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    CommentModel.deleteMany({
      post: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "комментарии не найдены",
          });
        }
        res.json({
          success: true,
        });
      })
      .catch((err) =>
        res.status(500).json({ message: "Не удалось удалить комментарии" })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить комментарии",
    });
  }
};
