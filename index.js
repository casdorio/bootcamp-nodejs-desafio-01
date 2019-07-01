const express = require("express");
const server = express();

server.use(express.json());

//Contador zerado
var n = 0;
//objeto projects
const projects = [];

//Verifica se existe id do projects
function CheckExists_id(req, res, next) {
  const index = projects.map(x => x.id).indexOf(req.params.id);
  if (!projects[index]) {
    return res.status(400).json({ error: "There is no project with this id" });
  }
  return next();
}

//Função que faz as contagens das requisições
function countRequest(req, res, next) {
  n++;
  console.log(`Total requests: ${n}`);
  return next();
}

//lista todos projetos
server.get("/projects", countRequest, (req, res) => {
  return res.json(projects);
});

//Cadastra um novo projeto
server.post("/projects", countRequest, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);
  return res.json(projects);
});


//Edita um projeto existente pelo id
server.put("/projects/:id", countRequest, CheckExists_id, (req, res) => {
  const index = projects.map(x => x.id).indexOf(req.params.id);
  projects[index].title = req.body["title"];
  return res.json(projects);
});

//Deleta um projeto pelo id
server.delete("/projects/:id", countRequest, CheckExists_id, (req, res) => {
  const index = projects.map(x => x.id).indexOf(req.params.id);
  projects.splice(index, 1);
  return res.send();
});

//cadastra uma nova tarefa pelo id do projects
server.post("/projects/:id/tasks", countRequest, CheckExists_id, (req, res) => {
  const index = projects.map(x => x.id).indexOf(req.params.id);
  projects[index].tasks.push(req.body["title"]);
  return res.json(projects);
});


server.listen(3333);
