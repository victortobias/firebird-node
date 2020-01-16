var bodyParser = require('body-parser')
var fs = require('fs')
var fb = require('firebird')



//BASE LOJA
var options1 = {};

options1.host = '127.0.0.1';
options1.port = 3050;
options1.database = 'C:/converter/origem.fdb';
options1.user = 'SYSDBA';
options1.password = 'sbofutura';
options1.role = '';

var con1 = fb.createConnection();
con1.connectSync(options1.database, options1.user, options1.password, options1.role);
var consCod1 = con1.querySync("select * from PRODUTO_CODIGO_BARRA");

// con.commitSync();
var barra1 = consCod1.fetchSync("all",true);


//BASE ATACADO
var options2 = {};

options2.host = '127.0.0.1';
options2.port = 3050;
options2.database = 'C:/converter/destino.fdb';
options2.user = 'SYSDBA';
options2.password = 'sbofutura';
options2.role = '';


var con2 = fb.createConnection();
con2.connectSync(options2.database, options2.user, options2.password, options2.role);

for (var i = 0; i < barra1.length; i++) {
	var cod_barra = barra1[i].CODIGO_BARRA
	var fk_r = barra1[i].FK_PRODUTO

	var consPreco1 = con1.querySync("select * from PRODUTO_PRECO WHERE FK_TABELA_PRECO = 1 AND FK_PRODUTO = "+fk_r);
	var preco1 = consPreco1.fetchSync("all",true);
	var valor1 = preco1[0].VALOR
	var lucro1 = preco1[0].LUCRO

	
	
	// console.log('---INÍCIO - ORIGEM---')
	// console.log(cod_barra, '\n', fk_r, '\n', valor1, '\n', lucro1)
	// console.log('---FIM - ORIGEM---')


	cod_barra = cod_barra.replace(/[^\d]+/g,'')	
	//consulta codigo de barra
	var consCod2 = con2.querySync("select * from PRODUTO_CODIGO_BARRA WHERE PRODUTO_CODIGO_BARRA.CODIGO_BARRA = '"+cod_barra+"'");
	
	try {
		var barra2 = consCod2.fetchSync("all",true);
	}finally{
		// console.log('')
	}

	if(barra2.length > 0){
		var fk_r2 = barra2[0].FK_PRODUTO

		// consulta preço
		var consPreco2 = con2.querySync("select * from PRODUTO_PRECO WHERE PRODUTO_PRECO.FK_TABELA_PRECO = 1 AND FK_PRODUTO = "+fk_r2);
		var preco2 = consPreco2.fetchSync("all",true);
		var valor2 = preco2[0].VALOR

		// console.log('---INÍCIO - DESTINO---')
		// console.log(cod_barra, '\n', fk_r2, '\n', valor2)
		// console.log('---FIM - DESTINO---')


		con2.querySync("UPDATE PRODUTO_PRECO SET VALOR = "+valor1+", LUCRO = "+lucro1+" WHERE FK_PRODUTO = "+fk_r2+" AND FK_TABELA_PRECO = 1");

		console.log(i)
	}else{
		// console.log('Produto nao encontrado')
	}
	

}

con2.commitSync();
console.log('CONCLUIDO')