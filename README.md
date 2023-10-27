# Desafio Konatus

Este é um projeto relacionado ao Desafio Konatus e contém uma aplicação para visualizar e atualizar resultados de pesquisas eleitorais. 

## Instalação

1. Clone o repositório do projeto:

```sh
git clone https://github.com/Degobi/KonatusChallenge
```

2. Navegue até a pasta do projeto:

```sh
cd KonatusChallenge
```
3. Instale as dependências:

```sh
npm install
```

## Configuração do Banco de Dados

O projeto utiliza o Sequelize para lidar com o banco de dados. Certifique-se de que o banco de dados está configurado corretamente no arquivo `src/config/database.js`.

Para criar as tabelas no banco de dados, você pode rodar o seguinte comando:

```sh
npx sequelize db:migrate
```
## Executando o Projeto

Para iniciar o servidor da aplicação, você pode usar o seguinte comando:

```sh
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

## Pacotes Utilizados

- [Chart.js](https://www.chartjs.org/) - Biblioteca para criar gráficos interativos.
- [Cors](https://www.npmjs.com/package/cors) - Middleware para habilitar requisições de origens diferentes (CORS).
- [csv-parser](https://www.npmjs.com/package/csv-parser) - Parser para arquivos CSV.
- [EJS](https://www.npmjs.com/package/ejs) - Motor de visualização para renderizar páginas da web.
- [Express](https://expressjs.com/) - Framework web para Node.js.
- [Iconv-lite](https://www.npmjs.com/package/iconv-lite) - Conversor de conjuntos de caracteres.
- [Mssql](https://www.npmjs.com/package/mssql) - Cliente para bancos de dados SQL Server.
- [Multer](https://www.npmjs.com/package/multer) - Middleware para manipulação de arquivos em formulários.
- [Sequelize](https://sequelize.org/) - ORM (Object-Relational Mapping) para bancos de dados relacionais.
- [XLSX](https://www.npmjs.com/package/xlsx) - Biblioteca para ler e escrever arquivos Excel.

Este projeto foi criado usando Node.js e Express. Além disso, você precisará configurar um banco de dados SQL Server para funcionar corretamente.

---

Lembre-se de configurar o arquivo `config/database.js` com as informações do seu banco de dados e de ter as dependências instaladas antes de rodar o projeto.

