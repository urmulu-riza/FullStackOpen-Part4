const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const { response } = require('express');

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
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
    expect(response.body).toHaveLength(initialBlogs.length);
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
  test.only('a valid new blog is added to DB', async () => {
    const newBlog = {
      title: 'Learn Modern Web Dev - MOOC',
      author: 'Urmulu Riza',
      url: 'https://example2.com',
      likes: 15,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    expect(response.body).toHaveLength(initialBlogs.length + 1);
    expect(titles).toContain('Learn Modern Web Dev - MOOC');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
}, 20000);
