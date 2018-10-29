var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const getFiles = () =>
    new Promise((response, reject) => {
      fs.readdir(process.env.RUTA_ARCHIVOS, (err, files) => {
        console.log('Scan Files', files);
        if (err) reject(err);

        const getData = files.map(
          file =>
            new Promise((response, reject) => {
              fs.readFile(`./data/${file}`, 'utf8', (err, data) => {
                if (err) reject(err);
                response(data);
              });
            }),
        );

        Promise.all(getData).then(res => {
          response(res);
        });
      });
    });

  getFiles()
    .then(data => {
      return data.map(file => {
        const fileParse = file
          .split('<p>')
          .splice(1)
          .map(i => i.split('</p>')[0]);

        const obj = {
          capaAnalizada: null,
          campoAnalizado: null,
          recuento: null,
          valoresUnicos: null,
          valorMinimo: null,
          valorMaximo: null,
          intervalo: null,
          suma: null,
          valorMedio: null,
          mediana: null,
          desviacionEstandar: null,
          coeficienteVariacion: null,
          minoria: null,
          mayoria: null,
          primerCuartil: null,
          tercerCuartil: null,
          valoresNulos: null,
          rangoIntercuartil: null,
        };

        fileParse.forEach(i => {
          const el = i.split(':');
          switch (el[0]) {
            case 'Capa analizada':
              obj.capaAnalizada = el[1];
              break;
            case 'Campo analizado':
              obj.campoAnalizado = el[1];
              break;
            case 'Recuento':
              obj.recuento = el[1];
              break;
            case 'Valores únicos':
              obj.valoresUnicos = el[1];
              break;
            case 'Valor mínimo':
              obj.valorMinimo = el[1];
              break;
            case 'Valor máximo':
              obj.valorMaximo = el[1];
              break;
            case 'Intervalo':
              obj.intervalo = el[1];
              break;
            case 'Suma':
              obj.suma = el[1];
              break;
            case 'Valor medio':
              obj.valorMedio = el[1];
              break;
            case 'Mediana':
              obj.mediana = el[1];
              break;
            case 'Desviación estándar':
              obj.desviacionEstandar = el[1];
              break;
            case 'Coeficiente de variación':
              obj.coeficienteVariacion = el[1];
              break;
            case 'Minoría (valor más raro presente)':
              obj.minoria = el[1];
              break;
            case 'Mayoría (valor presente con más frecuencia)':
              obj.mayoria = el[1];
              break;
            case 'Primer cuartil':
              obj.primerCuartil = el[1];
              break;
            case 'Tercer cuartil':
              obj.tercerCuartil = el[1];
              break;
            case 'Valores NULOS (faltan)':
              obj.valoresNulos = el[1];
              break;
            case 'Rango intercuartil (IQR)':
              obj.rangoIntercuartil = el[1];
              break;
          }
        });
        return obj;
      });
    })
    .then(data => {
      res.status(200).render('index', { data });
    })

    .catch(err => {
      console.log(err);
      res.status(200).render('error', { error: err });
    });
});

module.exports = router;
