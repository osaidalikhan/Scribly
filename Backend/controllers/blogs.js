const { StatusCodes } = require("http-status-codes");
const Blog = require("../models/Blog");

const getAllBlogs = async (req, res) => {
  try {
    const { search, category } = req.query;

    const filters = {
      ...(search && search.trim() !== "" && { search: search.trim() }),
      ...(category && category !== "all" && { category }),
    };

    const blogs = await Blog.getAllBlogs(filters);

    res.status(StatusCodes.OK).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};
const getUserBlogs = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const blogs = await Blog.getBlogsByUserId(id);
    res.status(StatusCodes.OK).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message || "Something went wrong." });
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.getBlogById(id);

    if (!blog) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Blog not found" });
    }

    const relatedBlogs = await Blog.getBlogsByCategory(blog.category, blog.id);

    // Fire-and-forget: don't block the response on the view counter.
    Blog.incrementViews(id).catch((err) =>
      console.error("Error incrementing views:", err)
    );

    res.status(StatusCodes.OK).json({
      blog,
      relatedBlogs,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const createBlog = async (req, res) => {
  console.log("req.file", req.file);
  const { title, description, category } = req.body;
  const userId = req.user?.userId;
  const image = req.file?.filename || null;

  if (!title || !category) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Title and category are required" });
  }

  try {
    const blog = await Blog.createBlog({
      userId,
      title,
      description,
      image,
      category,
    });
    res.status(StatusCodes.CREATED).json(blog);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;
  const image = req.file?.filename || req?.body?.image || null;

  try {
    await Blog.updateBlog(id, { title, description, image, category });
    res.status(StatusCodes.OK).json({ msg: "Blog updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await Blog.deleteBlogById(id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
};
