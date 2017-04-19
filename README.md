# tapioca-load
Um módulo feito para quem é preguiçoso

Importe arquivos, rotas do [Express](http://npmjs.org/package/express) ou até mesmo models do [Mongoose](http://npmjs.org/package/mongoose)!

## Instalação
Como qualquer outro módulo do `npm`, execute o comando:

```bash
npm install tapioca-load --save
```

## tapioca-load com Express

Carregue todas as rotas contidas em uma pasta automaticamente e poupe algumas linhas de código!

`app.js`
```javascript
const 
    express = require('express'), // Importa o express
    tapioca = require('tapioca-load'), // importa o tapioca-load
    app     = express(); // Inicializa uma nova aplicação do Express

tapioca() // Inicializa o tapioca-loader
    .add("routes") // Adiciona a pasta 'routes'
    .load(app); // Carrega as pastas e usamos o 'app' para criar as rotas
    
    // Inicia a aplicação
    app.listen(3000, () => console.log("Aplicação Iniciada na porta 3000"));
```

`routes/home.js`

```javascript
module.exports = app => { // Pegamos o 'app' passado no load
    app.route("/").get((request, response, next) => {
        response.send("Hello World!");
    });
}
```

## Todas as opções
```javascript
const tapioca = require('tapioca-load');

tapioca({
    cwd: "caminho/para/o/diretorio", // Define a pasta raíz para procurar arquivos
    ignore: [
        'arquivo.js', // Ignorando um arquivo na raíz do projeto
        'diretorio/para/o/arquivo.js', // Ignorando arquivos dentro de pastas
        /-test\.js$/g // Ignorando arquivos terminados com -test.js
    ],
    log: 1 // Define o a frêquencia de mensagens de logs. 
           // 4 é o nível que exibe todas as mensagens,
           // 0 não exibe mensagens de log
});
```

## Métodos
- add(entidade): Adiciona um arquivo ou pasta a ser carregado
- load(obj): Carrega todas as entidades adicionadas, 
             passa o object para as funções doas arquivos e os 
             dados retornados são gravados no object.
             
Em breve mais métodos e opções

## Contribua
- [GitHub](https://github.com/salomaosnff/tapioca-load)
- [Issues](https://github.com/salomaosnff/tapioca-load/issues)
- [Pull Request](https://github.com/salomaosnff/tapioca-load/pulls)
- Siga [Salomão Neto](https://github.com/salomaosnff)

## Licensa
[MIT](https://github.com/salomaosnff/tapioca-load/blob/master/LICENSE)