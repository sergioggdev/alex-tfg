import React, { Component } from 'react';
import { ipcRenderer, remote } from 'electron';
const { dialog } = remote;

const buttonStyle = {
  padding: '10px 15px',
  border: '2px solid #2e2e2e',
  borderRadius: '5px',
  display: 'inline-block',
};

const scrollStyle = {
  overflow: 'scroll',
};

const bodyStyle = {
  padding: '20px',
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.clickHandle = this.clickHandle.bind(this);
    this.state = {
      response: null,
    };
  }

  componentDidMount() {
    ipcRenderer.on('statisticsData', (event, arg) => {
      this.setState({
        response: arg,
      });
    });
  }

  clickHandle() {
    dialog.showOpenDialog(
      {
        properties: ['openDirectory'],
      },
      url => {
        if (url) ipcRenderer.send('getData', url[0]);
      },
    );
  }

  render() {
    console.log('state', this.state);
    return (
      <div style={bodyStyle}>
        <h2>Analisis</h2>
        <a style={buttonStyle} onClick={this.clickHandle}>
          Seleccionar carpeta
        </a>

        {this.state.response && this.state.response.data && (
          <div>
            <div style={scrollStyle}>
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>capaAnalizada</th>
                    <th>campoAnalizado</th>
                    <th>recuento</th>
                    <th>valoresUnicos</th>
                    <th>valorMinimo</th>
                    <th>valorMaximo</th>
                    <th>intervalo</th>
                    <th>suma</th>
                    <th>valorMedio</th>
                    <th>mediana</th>
                    <th>desviacionEstandar</th>
                    <th>coeficienteVariacion</th>
                    <th>minoria</th>
                    <th>mayoria</th>
                    <th>primerCuartil</th>
                    <th>tercerCuartil</th>
                    <th>valoresNulos</th>
                    <th>rangoIntercuartil</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.response.data.map((file, index) => (
                    <tr key={index}>
                      <td>{file.files[index]}</td>–<td>{file.capaAnalizada}</td>
                      <td>{file.campoAnalizado}</td>
                      <td>{file.recuento}</td>
                      <td>{file.valoresUnicos}</td>
                      <td>{file.valorMinimo}</td>
                      <td>{file.valorMaximo}</td>
                      <td>{file.intervalo}</td>
                      <td>{file.suma}</td>
                      <td>{file.valorMedio}</td>
                      <td>{file.mediana}</td>
                      <td>{file.desviacionEstandar}</td>
                      <td>{file.coeficienteVariacion}</td>
                      <td>{file.minoria}</td>
                      <td>{file.mayoria}</td>
                      <td>{file.primerCuartil}</td>
                      <td>{file.tercerCuartil}</td>
                      <td>{file.valoresNulos}</td>
                      <td>{file.rangoIntercuartil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <table>
                <thead>
                  <tr>
                    <th>Estadisticas segun aeronave</th>
                    <th>Ala fija</th>
                    <th>Ala rotatoria</th>
                    <th>Aeroestatos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Aviacion General</th>
                    <th>66%</th>
                    <th>20,45%</th>
                    <th>2,49%</th>
                  </tr>
                  <tr>
                    <th>Aviacion Comercial</th>
                    <th>6,25%</th>
                    <th>1,94%</th>
                    <th>0,24%</th>
                  </tr>
                  <tr>
                    <th>Otros</th>
                    <th>2,08%</th>
                    <th>0,65%</th>
                    <th>0,08%</th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <p>Texto aclaratorio</p>
            </div>
          </div>
        )}

        {this.state.response && this.state.response.err && (
          <div>
            <p>Ha habido un problema al obtener los datos</p>
            <span>{this.state.response.err}</span>
          </div>
        )}
      </div>
    );
  }
}
