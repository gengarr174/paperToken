# 🪙 Paper Token

Sistema web de gerenciamento de arquivos com autenticação, controle de acesso por perfis e sistema de moedas (tokens). Desenvolvido com Node.js, Express e SQLite.

---

## 📋 Sobre o projeto

Paper Token é uma plataforma onde usuários autenticados podem fazer upload, gerenciar e baixar arquivos pessoais. O sistema possui dois perfis distintos — **usuário comum** e **administrador** — cada um com seu painel e permissões específicas. Usuários acumulam moedas completando captchas, e administradores gerenciam os usuários da plataforma.

---

## 🚀 Funcionalidades

### Autenticação
- Registro com nome, sobrenome, e-mail e senha
- Opção de cargo administrativo via chave secreta
- Login com proteção contra enumeração de usuários
- Sessões seguras com regeneração após login (`session.regenerate`)
- Logout com destruição completa da sessão
- Proteção CSRF em todos os formulários

### Painel do Usuário
- Listagem de arquivos com nome, tamanho e data de upload
- Upload de arquivos (PNG, JPG, JPEG, TXT — máx. 5 MB)
- Renomear arquivos
- Excluir arquivos
- Download de arquivos

### Sistema de Moedas
- Saldo de moedas exibido na navbar em tempo real
- Captcha de texto com imagem de fundo para ganhar moedas
- Histórico de transações na carteira

### Painel do Administrador
- Listagem de todos os usuários cadastrados
- Banir e desbanir usuários
- Excluir usuários (protegido contra exclusão de admins)
- Estatísticas de ativos e banidos

---

## 🗂️ Estrutura do Projeto

```
paper-token/
├── database/
│   ├── data.db               # Banco de dados 
│   └── sessions.sqlite       # Banco de sessões
│
├── public/
│   ├── css/
│   │   ├── style.css         # CSS global compartilhado
│   │   ├── auth.css          # CSS exclusivo da tela de autenticação
│   │   ├── 404.css           # CSS exclusivo da tela de erro 404
│   │   └── 500.css           # CSS exclusivo da tela de erro 500
│   ├── img/
│   │   ├── undraw_upload_cucu.svg
│   │   └── captcha-bg.png
│   └── js/
│       ├── auth.js           # JS da tela de login/registro
│       ├── home_admin.js     # JS da tela home do admin
│       └── home_user.js      # JS da tela home do user
│
├── src/
│   ├── controllers/
│   │   ├── homeController.js
│   │   ├── loginController.js
│   │   ├── uploadController.js
│   │   ├── captchaController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── connection.js     # Conexão SQLite + criação das tabelas
│   │
│   ├── middlewares/
│   │   ├── middleware.js     # loginRequired, csrfMidWare, globalMid
│   │   └── upload.js         # Configuração do multer
│   │
│   ├── models/
│   │   ├── HomeModel.js           # Queries de arquivos e usuários
│   │   ├── UserModel.js           # Queries de dados de usuário
│   │   ├── LoginModel.js          # Autenticação e registro
│   │   ├── UploadModel.js         # Validação e inserção de arquivos
│   │   └── CaptchaModel.js        # Adição de tokens
│   │
│   ├── views/
│   │   ├── auth.ejs
│   │   ├── home_user.ejs
│   │   ├── home_admin.ejs
│   │   ├── 404.ejs
│   │   ├── 500.ejs
│   │   ├── includes/
│   │       ├── header.ejs
│   │       ├── footer.ejs
│   │       └── messages.ejs
│   │       └── partials/
│   │         ├── captcha.ejs
│   │         ├── delete.ejs
│   │         ├── edit.ejs
│   │         ├── logout.ejs
│   │         ├── password.ejs
│   │         ├── profile.ejs
│   │         ├── tokens.ejs
│   │         └── upload.ejs
│   │
│   └── routes.js
│
├── uploads/                  # Arquivos enviados pelos usuários (gerado em runtime)
├── app.js
├── server.js
├── .env
└── package.json
```

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Banco de dados | SQLite 3 |
| Template engine | EJS |
| Autenticação | express-session + bcryptjs |
| Upload | Multer |
| Segurança | Helmet, csurf, connect-flash |
| Frontend | Bootstrap 5 + Bootstrap Icons |
| Validação | validator.js |

---

## ⚙️ Instalação

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/paper-token.git
cd paper-token
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
SESSION_SECRET=sua_chave_secreta_aqui
ADMIN_KEY=chave_para_registro_admin
DB_PATH=./database/papertoken.sqlite
NODE_ENV=development
```

**4. Inicie o servidor**
```bash
node server.js
```

Acesse em `http://localhost:3000`

---

## 🔒 Segurança

- Senhas armazenadas com **bcrypt** (salt rounds: 12)
- Proteção **CSRF** em todos os formulários
- Headers de segurança via **Helmet**
- Sessões com `httpOnly`, `sameSite` e `secure` (em produção)
- Regeneração de sessão após login para prevenir **session fixation**
- Validação de tipo MIME no upload (não apenas extensão)
- Sanitização de `originalname` contra **path traversal**
- Administradores protegidos contra exclusão e banimento
- Mensagem genérica no login para evitar **enumeração de usuários**

---

## 👤 Perfis de Acesso

| Ação | Usuário | Admin |
|---|:---:|:---:|
| Upload de arquivos | ✅ | ❌ |
| Download de arquivos | ✅ | ❌ |
| Renomear arquivos | ✅ | ❌ |
| Excluir arquivos | ✅ | ❌ |
| Ganhar moedas (captcha) | ✅ | ❌ |
| Listar usuários | ❌ | ✅ |
| Banir / desbanir usuários | ❌ | ✅ |
| Excluir usuários | ❌ | ✅ |

---

## 📄 Licença

Este projeto está sob a licença MIT.
