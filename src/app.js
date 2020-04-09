const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(req, res, next) {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found' });
  }

  req.repositoryIndex = repositoryIndex;

  return next();
}

app.use('/repositories/:id', verifyId);

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const id = uuid();

  const newRepository = { id, title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return res.json(newRepository);
});

app.put("/repositories/:id", (req, res) => {
  const { repositoryIndex } = req;
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const { likes } = repositories[repositoryIndex];

  const repository = { id, title, url, techs, likes };

  repositories[repositoryIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { repositoryIndex } = req;

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { repositoryIndex } = req;

  const { likes } = repositories[repositoryIndex];

  repositories[repositoryIndex].likes += 1;
  
  return res.json({ likes: likes + 1 });
});

module.exports = app;
