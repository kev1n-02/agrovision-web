// =====================================================================
// Colores y nombres que se repiten en toda la app.
// Los colores por enfermedad son los MISMOS de los gráficos del notebook
// (ProyectoAnalisisPlantas), para que la app y el análisis coincidan.
// =====================================================================
import { Rol } from './modelos';

export const COLOR_ENFERMEDAD: Record<string, string> = {
  healthy: '#008300',
  scab: '#2a78d6',
  frog_eye_leaf_spot: '#eb6834',
  rust: '#6250d6',
  powdery_mildew: '#eda100',
  complex: '#e87ba4',
};

/** Color de una enfermedad por su código; gris si no se conoce. */
export function colorEnfermedad(codigo: string): string {
  return COLOR_ENFERMEDAD[codigo] ?? '#8a8f84';
}

export const NOMBRE_ROL: Record<Rol, string> = {
  ADMINISTRADOR: 'Administrador',
  TECNICO: 'Técnico',
  PRODUCTOR: 'Productor',
};

export const NOMBRE_ESTADO_DIAGNOSTICO: Record<string, string> = {
  pendiente: 'Por revisar',
  confirmado: 'Confirmado',
  corregido: 'Corregido',
};
