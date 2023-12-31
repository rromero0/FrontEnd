import React, { useEffect, useState } from 'react';
import { obtenerDocentes, actualizarDocentes } from '../actualizarDatos.js';
import axios from 'axios';
import EliminarDocente from './eliminarDoc';
import AgregarDocente from './agregarDoc';
import ModificarDocente from './modificarDoc';

const ListadoDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [carreras, setCarreras] = useState({});
  const [filtroBusqueda, setFiltroBusqueda] = useState('');

  useEffect(() => {
    obtenerDatosDocentes();
    obtenerDatosCarreras();
  }, []);

  const obtenerDatosDocentes = async () => {
    try {
      const docentesData = await obtenerDocentes();
      setDocentes(docentesData);
    } catch (error) {
      console.error('//Error al obtener los docentes:', error);
    }
  };

  const obtenerDatosCarreras = () => {
    axios
      .get('https://apilab-backend-sandbox.up.railway.app/obtenercarreras')
      .then(response => {
        const carrerasMap = response.data.reduce((map, carrera) => {
          map[carrera.id] = carrera.carrera;
          return map;
        }, {});
        setCarreras(carrerasMap);
      })
      .catch(error => {
        console.error('Error al obtener las carreras:', error);
      });
  };

  const handleDocenteModificado = async () => {
    try {
      await actualizarDocentes();
      obtenerDatosDocentes();
      obtenerDatosCarreras();
    } catch (error) {
      console.error('Error al modificar al docente:', error);
    }
  };

  const handleDocenteEliminado = async () => {
    try {
      await actualizarDocentes();
      obtenerDatosDocentes();
      obtenerDatosCarreras();
    } catch (error) {
      console.error('Error al eliminar al docente:', error);
    }
  };

  const handleDocenteAgregado = async () => {
    try {
      await actualizarDocentes();
      obtenerDatosDocentes();
      obtenerDatosCarreras();

    } catch (error) {
      console.error('Error al agregar al docente:', error);
    }
  };

  const handleFiltroBusquedaChange = (e) => {
    setFiltroBusqueda(e.target.value);
  };

  const docentesFiltrados = docentes.filter(docente => {
    const nombreApellido = `${docente.nombre} ${docente.apellido}`.toLowerCase();
    const carrera = carreras[docente.id_carrera]?.toLowerCase();

    return (
      !filtroBusqueda ||
      nombreApellido.includes(filtroBusqueda.toLowerCase()) ||
      carrera.includes(filtroBusqueda.toLowerCase())
    );
  });

  return (
    <div className='row' style={{ minHeight: '700px'}}>
      <p className='fs-2'>Listado de Docentes</p>
      <div className='row align-items-start'>
        <div className='row'>
          <div className='col-xs-1 col-md-1'>
            <label htmlFor='filtroBusqueda' className='form-label fs-5'>Buscar:</label>
          </div>
          <div className='col-2  pt-1'>
            <input
              type='text'
              id='filtroBusqueda'
              className='form-control fs-6'
              value={filtroBusqueda}
              onChange={handleFiltroBusquedaChange}
            />
          </div>
        </div>
        <div className='col-xs-10 col-md-10 table-responsive' style={{ height: '500px' }}><br />
          <table className="table table-dark table-striped table-hover caption-top align-middle">
            <thead>
              <tr>
                <th className="w-20">Nombre</th>
                <th className="w-20">Apellido</th>
                <th className="w-20 text-center">Email</th>
                <th className="w-20 text-center">Carrera</th>
                <th className="w-10 text-center">Modificar</th>
                <th className="w-10 text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {docentesFiltrados.map(docente => (
                <tr key={docente.id}>
                  <td>{docente.nombre}</td>
                  <td>{docente.apellido}</td>
                  <td className='text-center'>{docente.email}</td>
                  <td className='text-center'>{carreras[docente.id_carrera]}</td>
                  <td className='text-center'>
                    <ModificarDocente docente={docente} onDocenteModificado={handleDocenteModificado} />
                  </td>
                  <td className='text-center'>
                    <EliminarDocente docenteId={docente.id} onDocenteEliminado={handleDocenteEliminado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='col-xs-2 col-md-2 table-responsive'>
          <AgregarDocente onDocenteAgregado={handleDocenteAgregado} />
        </div>
      </div>
    </div>
  );
};

export default ListadoDocentes;
