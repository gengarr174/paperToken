# sup☁️ Paper Token API

Paper Token é uma API desenvolvida em JavaScript utilizando Node.js, Express e SQLite que simula o funcionamento de um serviço de armazenamento em nuvem.

A aplicação permite que usuários façam upload e download de arquivos (texto e imagens) utilizando um sistema de tokens internos, que limita a quantidade de arquivos enviados para o armazenamento.

O sistema também possui controle de cargos (Admin e User), permitindo gerenciamento da plataforma e monitoramento do uso do armazenamento.

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC).

## 📌 Funcionalidades
### 👤 Sistema de Usuários

- Cadastro de usuários
- Autenticação
- Sistema de cargos (Admin / User)

### ☁️ Armazenamento em Nuvem (Simulado)
- Upload de arquivos
- Download de arquivos
- Suporte para:
    - Arquivos de texto (.txt)
    - Imagens (.png, .jpg)

### 💰 Sistema de Tokens
- Cada upload consome tokens
- Tokens limitam o uso da plataforma
- Usuários podem ganhar tokens resolvendo captchas

### 🛡 Administração
- Usuários com cargo Admin podem:
- Visualizar usuários cadastrados
- Ver a quantidade de armazenamento utilizado por cada usuário
- Banir usuários da plataforma

**⚠️ Por questões de privacidade, administradores não possuem acesso ao conteúdo dos arquivos enviados pelos usuários, apenas às informações de uso.**

### 📂 Gerenciamento de Arquivos

Usuários podem:
- Fazer upload de arquivos
- Fazer download de seus arquivos
- Listar seus arquivos armazenados
- Remover arquivos

### 🛠 Tecnologias Utilizadas
- JavaScript
- Node.js
- Express
- SQLite
- Multer (upload de arquivos)
- JWT / Sessions (autenticação)
- Nodemon (desenvolvimento)
