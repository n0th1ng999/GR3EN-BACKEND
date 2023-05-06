/**
 * @param {String} string String para verificar se é um numero
 * @param {Function}  callback executa uma funçao definida pelo o utilizador sendo que vai utilizar como argumento verdadeiro ou falso 
 * Se nao for um numero devolve falso
 */

module.exports= (string,callback) => {
    if(isNaN(Number(string))){
        return callback(true)
    }else{
        return callback(false)
    }
}