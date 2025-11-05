const express = require("express");
const app = express();
app.use(express.json());
const pino = require("pino");
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// our "database" data
let users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

let movies = [
  { id: 1, title: "Treasure Planet", year: 2002 },
  { id: 2, title: "The Matrix", year: 1999 }
];

let reviews = [
  { id: 1, movieId: 1, userId: 2, text: "Very underrated movie!" },
  { id: 2, movieId: 1, userId: 1, text: "Best animated movie ever." },
  { id: 3, movieId: 2, userId: 1, text: "Classic sci-fi." }
];

app.get("/movies", (req, res) => {
  logger.info("Fetching all movies");
  res.json(movies);
  logger.info("All movies sent");
});

app.get("/movies/:id", (req, res) => {
  logger.info(`Fetching movie with id ${req.params.id}`);
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) {
    logger.error(`Movie with id ${req.params.id} not found`);
    return res.status(404).json({ error: "Movie not found" });
  }

  // when returning a single movie we want to send back all the info about the movie
  // including the reviews of it
  logger.info(`Movie with id ${req.params.id} found`);
  const movieReviews = reviews.filter(r => r.movieId === movie.id);
  res.json({
    id: movie.id,
    title: movie.title,
    year: movie.year,
    reviews: movieReviews
  });
  logger.info(`Movie with id ${req.params.id} sent`);
});

app.get("/reviews/:id", (req, res) => {
  logger.info(`Fetching review with id ${req.params.id}`);
  const review = reviews.find(r => r.id === parseInt(req.params.id));
  if (review) {
    res.json(review);
  } else {
    logger.error(`Review with id ${req.params.id} not found`);
    res.status(404).json({ error: "Review not found" });
  }
  logger.info(`Review with id ${req.params.id} sent`);
});

app.get("/users", (req, res) => {
  logger.info("Fetching all users");
  res.json(users);
  logger.info("All users sent");
});

app.get("/users/:id", (req, res) => {
  logger.info(`Fetching user with id ${req.params.id}`);
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    logger.info(`User with id ${req.params.id} found`);
    res.json(user);
  } else {
    logger.error(`User with id ${req.params.id} not found`);
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/reviews", (req, res) => {
  logger.info("Fetching all reviews");
  res.json(reviews);
  logger.info("All reviews sent");
});

app.post("/reviews", (req, res) => {
  logger.info("Creating a new review");
  const newReview = { id: reviews.length + 1, ...req.body };
  reviews.push(newReview);
  res.status(201).json(newReview);
  logger.info(`New review created with id ${newReview.id}`);
});

app.listen(3000, () => logger.info("Movie App monolith running on port 3000"));