import React, { useState } from 'react';
import axios from 'axios';

const ModificarLaboratorio = ({ laboratorio, onLaboratorioModificado }) => {
  const [nombre, setNombre] = useState(laboratorio.nombre);
  const [ubicacion, setUbicacion] = useState(laboratorio.ubicacion);
  const [capacidad, setCapacidad] = useState(laboratorio.capacidad || 0);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const [alertaDuplicidad, setAlertaDuplicidad] = useState(false);

  const MAX_CARACTERES_NOMBRE = 30;
  const MAX_CARACTERES_UBICACION = 30;
  const MAX_DIGITOS_CAPACIDAD = 3;

  const handleModificar = () => {
    abrirModal();
  };

  const handleCancelar = () => {
    cerrarModal();
    resetForm();
  };

  const handleGuardar = async () => {
    if (!nombre || !ubicacion || !capacidad) {
      setAlertaVisible(true);
      setAlertaDuplicidad(false);
      return;
    }

    const laboratorioModificado = {
      id: laboratorio.id,
      nombre: nombre,
      ubicacion: ubicacion,
      capacidad: capacidad,
    };

    if (laboratorio.nombre != nombre) {
      console.log('distintos')
      // Obtener la lista de laboratorio existentes
      const response = await axios.get('https://apilab-backend-sandbox.up.railway.app/obtenerlaboratorios');
      const laboratoriosExist = response.data;

      // Verificar si el nuevo laboratorio ya existe
      const laboratorioExistente = laboratoriosExist.some(
        (laboratorio) => laboratorio.nombre === nombre
      );

      if (laboratorioExistente) {
        setAlertaDuplicidad(true);
        setAlertaVisible(false);
        return;
      } else {
        setAlertaDuplicidad(false);
      }
    } else {
      console.log('iguales')
    }


    axios
      .put(`https://apilab-backend-sandbox.up.railway.app/modificarlaboratorio/${laboratorio.id}`, laboratorioModificado)
      .then(response => {
        console.log('Laboratorio modificado:', response.data);
        onLaboratorioModificado(); // Actualiza los datos
        cerrarModal();
        resetForm();
      })
      .catch(error => {
        console.error('Error al modificar el laboratorio:', error);
      });
  };

  const abrirModal = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setAlertaVisible(false);
    setAlertaDuplicidad(false);
  };

  const resetForm = () => {
    setNombre((prevNombre) => prevNombre);
    setUbicacion((prevUbicacion) => prevUbicacion);
    setCapacidad((prevCapacidad) => prevCapacidad);
  };


  const handleNombreChange = e => {
    const value = e.target.value.slice(0, MAX_CARACTERES_NOMBRE);
    setNombre(value);
  };

  const handleUbicacionChange = e => {
    const value = e.target.value.slice(0, MAX_CARACTERES_UBICACION);
    setUbicacion(value);
  };

  const handleCapacidadChange = e => {
    let value = e.target.value;
    if (value < 1) {
      value = '';
    } else if (value.length > MAX_DIGITOS_CAPACIDAD) {
      value = value.slice(1, MAX_DIGITOS_CAPACIDAD);
    }
    setCapacidad(value);
  };

  return (
    <div>
      <button className="btn btn-warning btn-sm m-1 p-2" onClick={handleModificar}>
        Modificar
      </button>
      {modalVisible && (
        <div className="modal my-5" id="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content border border-white" style={{ height: '600px', background: 'rgb(35, 35, 35)' }}>
              <div className="modal-header">
                <h5 className="modal-title fs-3" style={{ color: 'white', marginLeft: '55px' }}>MODIFICAR LABORATORIO</h5>
                <button type="button" className="close" aria-label="Cerrar" style={{ backgroundColor: 'transparent', border: 'none' }} onClick={handleCancelar}>
                  <span className='fs-1' style={{ color: 'red', marginTop: '10px' }}>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group text-center">
                    <label className='fs-4' style={{ color: 'white' }}>Nombre:</label>
                    <input
                      type="text"
                      className="form-control  mx-auto"
                      value={nombre}
                      onChange={handleNombreChange}
                      maxLength={MAX_CARACTERES_NOMBRE}
                    />
                  </div>
                  <div className="form-group text-center">
                    <label className='fs-4' style={{ color: 'white' }}>Ubicación:</label>
                    <select
                      className='form-control mx-auto text-center'
                      style={{ maxWidth: '300px' }}
                      value={ubicacion}
                      onChange={handleUbicacionChange}
                    >
                      <option value="">Seleccionar piso</option>
                      <option value="2do piso">2do piso</option>
                      <option value="3er piso">3er piso</option>
                    </select>
                  </div>
                  <div className="form-group text-center">
                    <label className='fs-4' style={{ color: 'white' }}>Capacidad:</label>
                    <input
                      type="number"
                      className="form-control mx-auto"
                      value={capacidad}
                      onChange={handleCapacidadChange}
                      min={1}
                      max={Math.pow(10, MAX_DIGITOS_CAPACIDAD) - 1}
                    />
                  </div>
                </form>
              </div>
              {alertaVisible && (
                <div className="alert alert-danger d-flex mx-5" role="alert">
                  <svg className="text-center" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlinkHref="#exclamation-triangle-fill" />
                  </svg>
                  <div className=''>
                    No puedes dejar campos en sin rellenar
                  </div>
                </div>
              )}
              {alertaDuplicidad && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <svg width="24" height="24" role="img" aria-label="Danger:">
                    <use xlinkHref="#exclamation-triangle-fill" />
                  </svg>
                  <div>
                    El laboratorio ya existe.
                  </div>
                </div>
              )}
              <div className="modal-footer mx-auto">
                <button type="button" className="btn btn-dark btn-md m-3 p-2 border-white" onClick={handleGuardar}>
                  Guardar
                </button>
                <button type="button" className="btn btn-dark btn-md m-3 p-2 border-white" onClick={handleCancelar}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModificarLaboratorio;
