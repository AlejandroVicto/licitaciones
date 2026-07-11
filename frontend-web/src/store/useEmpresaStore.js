import { create } from 'zustand';
import { getEmpresas, crearEmpresa, actualizarEmpresa, getSocios, agregarSocio, eliminarSocio } from '../services/api';

const useEmpresaStore = create((set) => ({
  empresas: [],
  empresaSeleccionada: null,
  setEmpresas: (empresas) => set({ empresas }),
  setEmpresaSeleccionada: (empresa) => set({ empresaSeleccionada: empresa }),
  
  cargarEmpresas: async () => {
    try {
      const data = await getEmpresas();
      set({ empresas: data || [] });
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  },
  
  agregarEmpresa: async (empresaData) => {
    try {
      const nuevaEmpresa = await crearEmpresa(empresaData);
      set((state) => ({ empresas: [...state.empresas, nuevaEmpresa] }));
      return nuevaEmpresa;
    } catch (error) {
      console.error("Error al crear empresa:", error);
      throw error;
    }
  },

  editarEmpresa: async (id, empresaData) => {
    try {
      const empresaActualizada = await actualizarEmpresa(id, empresaData);
      set((state) => ({
        empresas: state.empresas.map((e) => (e.id === parseInt(id) ? empresaActualizada : e))
      }));
      return empresaActualizada;
    } catch (error) {
      console.error("Error al actualizar empresa:", error);
      throw error;
    }
  },

  cargarSocios: async (empresaId) => {
    try {
      return await getSocios(empresaId);
    } catch (error) {
      console.error("Error al cargar socios:", error);
      throw error;
    }
  },

  crearSocio: async (empresaId, data) => {
    try {
      return await agregarSocio(empresaId, data);
    } catch (error) {
      console.error("Error al agregar socio:", error);
      throw error;
    }
  },

  borrarSocio: async (socioId) => {
    try {
      return await eliminarSocio(socioId);
    } catch (error) {
      console.error("Error al eliminar socio:", error);
      throw error;
    }
  }
}));

export default useEmpresaStore;
