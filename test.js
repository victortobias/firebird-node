var bodyParser = require('body-parser')
var fs = require('fs')
var fb = require('firebird')

var options2 = {};

options2.host = '127.0.0.1';
options2.port = 3050;
options2.database = 'C:/converter/destino.fdb';
options2.user = 'SYSDBA';
options2.password = 'sbofutura';
options2.role = '';

var con2 = fb.createConnection();
con2.connectSync(options2.database, options2.user, options2.password, options2.role);


var consCod2 = con2.querySync("select * from PRODUTO_CODIGO_BARRA WHERE PRODUTO_CODIGO_BARRA.CODIGO_BARRA = '7898906459144'");
var barra2 = consCod2.fetchSync("all",true);

var fk_r2 = barra2[0].FK_PRODUTO

valor1 = 59.99
lucro1 = 1500

con2.querySync("UPDATE PRODUTO_PRECO SET VALOR = "+valor1+", LUCRO = "+lucro1+" WHERE FK_PRODUTO = "+fk_r2+" AND FK_TABELA_PRECO = 1");
con2.commitSync();