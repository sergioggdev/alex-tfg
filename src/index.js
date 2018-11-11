import { app, BrowserWindow, ipcMain } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
import fs from 'fs';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' });

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('getData', (event, arg) => {
  console.log('obteniendo datos del servidor....');

  parseFolderData(arg)
    .then(data => {
      event.sender.send('statisticsData', { data, err: null });
    })

    .catch(err => {
      console.log('Error:', err.message);
      event.sender.send('statisticsData', { err: err.message, data: null });
    });
});

function parseFolderData(ruta) {
  return new Promise((response, reject) => {
    const getFiles = () =>
      new Promise((response, reject) => {
        fs.readdir(ruta, (err, files) => {
          if (err) {
            reject(err);
          } else {
            console.log('Scan Files', files);

            const getData = files.map(
              file =>
                new Promise((response, reject) => {
                  fs.readFile(`${ruta}/${file}`, 'utf8', (err, data) => {
                    if (err) {
                      reject(err);
                    } else {
                      response(data);
                    }
                  });
                }),
            );

            Promise.all(getData)
              .then(res => {
                res.files = files;
                response(res);
              })
              .catch(err => {
                reject(err);
              });
          }
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
            files: data.files,
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
        response(data);
      })

      .catch(err => {
        reject(err);
      });
  });
}
