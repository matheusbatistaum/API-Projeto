const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); 

app.use(bodyParser.json());

const tarefasDBPath = 'tarefas.json';

app.get('/tarefas', (req, res) => {
  const tarefas = JSON.parse(fs.readFileSync(tarefasDBPath));
  res.json(tarefas);
});

app.post('/tarefas', (req, res) => {
  const novaTarefa = req.body;
  const tarefas = JSON.parse(fs.readFileSync(tarefasDBPath));
  novaTarefa.id = Date.now(); 
  tarefas.push(novaTarefa);
  fs.writeFileSync(tarefasDBPath, JSON.stringify(tarefas, null, 2));
  res.status(201).json(novaTarefa);
});

app.put('/tarefas/:id', (req, res) => {
  const tarefaId = parseInt(req.params.id);
  const tarefas = JSON.parse(fs.readFileSync(tarefasDBPath));

  
  const tarefa = tarefas.find((t) => t.id === tarefaId);
  
  if (!tarefa) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  
  tarefa.concluida = true;

  
  fs.writeFileSync(tarefasDBPath, JSON.stringify(tarefas, null, 2));

  res.json(tarefa);
});

app.delete('/tarefas/:id', (req, res) => {
  const tarefaId = parseInt(req.params.id);
  let tarefas = JSON.parse(fs.readFileSync(tarefasDBPath));
  tarefas = tarefas.filter((tarefa) => tarefa.id !== tarefaId);
  fs.writeFileSync(tarefasDBPath, JSON.stringify(tarefas, null, 2));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Servidor em execução na porta ${port}`);
});