import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    function unique(arr) {
      let result = [];

      for (let str of arr) {
        if (!result.includes(str)) {
          result.push(str);
        }
      }

      return result;
    }

    const tags = posts.map((obj) => obj.tags);

    const uniqueTags = unique(tags.flat())
      .filter((item) => item !== "")
      .slice(-5);

    res.json(uniqueTags);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getPostsFromTag = async (req, res) => {
  try {
    const postTag = req.params.tag;
    const posts = await PostModel.find({ tags: postTag })
      .populate("user")
      .exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getPopularSort = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ viewCount: -1 })
      .populate("user")
      .exec();
    console.log(posts);

    // const tags = posts
    //   .map((obj) => obj.tags)
    //   .flat()
    //   .slice(0, 5);

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();

    res.json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    console.log(req);

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user")
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json(doc);
      })
      .catch((err) =>
        res.status(500).json({ message: "Не удалось вернуть статью" })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена",
          });
        }
        res.json({
          success: true,
        });
      })
      .catch((err) =>
        res.status(500).json({ message: "Не удалось удалить статью" })
      );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить статьи",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(", "),
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось создать статью",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(", "),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить статьи",
    });
  }
};
