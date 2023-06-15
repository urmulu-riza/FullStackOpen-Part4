const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  if (request.params.id.length !== 24) {
    return response.status(400).json({ error: 'invalid id' }).end();
  }
  const blog = await Blog.findById(request.params.id);
  blog ? response.json(blog) : response.status(404).end();
});

blogsRouter.post('/', async (request, response) => {
  const { title, url, likes, author } = request.body;

  const blog = new Blog({
    title,
    author,
    url,
    likes,
  });
  if (!(blog.title && blog.author && blog.url)) {
    return response
      .status(400)
      .json({ error: 'title, author, and url are required' })
      .end();
  }
  if (!blog.likes) {
    blog.likes = 0;
  }
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = { title, author, url, likes };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
