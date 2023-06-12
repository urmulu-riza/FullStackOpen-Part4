const dummy = (blogs) => 1;
const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);
const favoriteBlog = (blogs) => {
  const likesArray = blogs.map((b) => b.likes);
  const maxIndex = likesArray.indexOf(Math.max(...likesArray));
  return blogs[0] ? blogs[maxIndex] : [];
};
module.exports = { dummy, totalLikes, favoriteBlog };
