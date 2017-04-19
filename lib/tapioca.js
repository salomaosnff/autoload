// Modules
const
    fs   = require('fs'),
    path = require('path'),
    pkg  = require('../package.json'),
    { path2Obj, deepMerge, path_base } = require('./functions')
;

/**
 * Autoload modules and scripts
 */
class Tapioca{

    /**
     * Autoload constructor
     * @param options
     * @returns {Tapioca}
     */
    constructor(options){
        if(!(this instanceof Tapioca)) return new Tapioca(options);

        options = options instanceof Object ? options : {};

        this.files   = [];
        this.object  = {};
        this.options = Object.assign({
            cwd: path.resolve(require.main.filename, ".."),
            ignore: []
        }, options);

        this.log("Autoload v" + pkg.version + " started!", 1);
    }

    /**
     * Exibe uma mensagem de log, o priority define a importância.
     * 1 - Error
     * 2 - Warning
     * 3 - Info
     * 4 - Log
     * @param msg
     * @param priority
     * @returns {Tapioca}
     */
    log(msg, priority){
        priority = parseInt(priority) || 1;

        if(priority > 0 && priority <= this.options.log){
            console.log("[Autoload]: "+msg);
        }

        return this;
    }

    /**
     * Adiciona um arquivo a ser carregado
     * @param entity
     * @returns {Tapioca}
     */
    add(entity){
        // A entidade é uma string?
        if(!entity || typeof entity !== "string") return this.log("Entidade inválida!", 1);

        // Entity recebe um path absoluto
        entity = path.resolve(this.options.cwd, entity);

        const
            $this = this,  // Atalho para a instância
            base  = path_base($this.options.cwd, entity) // Path relativo
        ;

        // A entidade existe?
        if(!fs.existsSync(entity))
            return $this.log("A entidade '" + base + "' não existe.", 2);

        const stat = fs.lstatSync(entity);

        // É um diretório?
        if(stat.isDirectory()){
            $this.log("Entrando no diretório '" + base + "'...", 4);

            // Leia o diretório
            fs.readdirSync(entity).forEach(ent => {
                ent = path.resolve(entity, ent);
                $this.add(ent);
            });

            return this;
        }

        // É um arquivo?
        if(stat.isFile()){
            $this.files.push(entity); // Adicionar aos arquivos
            $this.log("O Arquivo '" + base + "' foi adicionado!", 3);
        }

        return this;
    }

    /**
     * Inicia o carregamento dos arquivos adicionados
     * @param object
     */
    load(object){
        const $this = this; // Atalho para a instância

        // Carrega o módulo
        const load = (filepath, base) => {
            let mod = require(filepath);

            // Se for função, chamar a função e gravar resultado,
            // se não gravar resultado
            mod = typeof mod === "function" ? mod(object) : mod;

            // Salvar módulo no objeto
            let pathObj = path2Obj(base.replace(/\..+$/gi, ""), mod);
            object      = deepMerge(object, pathObj);

            // Carregar arquivo
            $this.log("Arquivo '" + base + "' carregado!", 4);
            return mod;
        };

        // Object deve ser um Objeto
        object = object !== null ? object : {};

        // Adicionar todos os arquivos, menos os ignorados.
        $this.files.forEach(filepath => {
            let mod    = {};
            const
                base = path_base($this.options.cwd, filepath),
                ignores = $this.options.ignore
            ;

            // Ignorar arquivos
            if(ignores instanceof Array && ignores.length > 0)
                ignores.some(ignore => {

                    // É string e é igual ao nome do arquivo Ou
                    // É uma Expressão regular que combina com o nome do arquivo
                    if(
                        (typeof ignore === "string" && ignore === base) ||
                        (ignore instanceof RegExp && ignore.test(base))
                    ){
                        // Ignorar
                        $this.log("Ignorando o arquivo '" + base + "'...", 3);
                        return false;
                    }

                    // Adicionar o arquivo
                    mod = load(filepath, base);
                    return true;
                });

            else mod = load(filepath, base);
        });

        return this;
    }
}

module.exports = options => (new Tapioca(options));
module.exports.Tapioca = Tapioca;