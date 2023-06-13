const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
}, 40000);

describe('GET/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 20000);

  test('get all blogs', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 20000);

  test('the blog titles list contains  "REACT patterns"', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    expect(titles).toContain('React patterns');
  }, 20000);

  test('unique identifier property is named id and exists', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body[0].id).toBeDefined();
  });
});

describe('HTTP POST request to  /api/blogs', () => {
  test('a valid new blog can be added to DB', async () => {
    const newBlog = {
      title: 'Learn Modern Web Dev - MOOC',
      author: 'Urmulu Riza',
      url: 'https://www.fullstackopen.com',
      likes: 15,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).toContain('Learn Modern Web Dev - MOOC');
  });

  test("if the likes property doesn't exist, likes defaults to zero", async () => {
    const newBlog = {
      title: 'Learn Modern Web Dev - MOOC',
      author: 'Urmulu Riza',
      url: 'https://www.fullstackopen.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
    const likes = blogsAtEnd.map((r) => r.likes);
    expect(likes[likes.length - 1]).toBe(0);
  });

  test('if the title or url properties are missing from the request data, the backend responds with the status code 400 Bad Request', async () => {
    const newBlog = {
      author: 'Urmulu Riza',
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);
