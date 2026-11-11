// =====================================================================
// Tipos de datos que devuelve la API.
// Coinciden con las respuestas JSON del backend, así TypeScript avisa si
// se usa un campo que no existe.
// =====================================================================

/** Formato común de todas las respuestas de la API. */
export interface Respuesta<T> {
  ok: boolean;
  mensaje: string;
  data: T;
}

export type Rol = 'ADMINISTRADOR' | 'TECNICO' | 'PRODUCTOR';

export interface Usuario {
  id: number;
  cedula: string;
  nombres: string;
  correo: string;
  rol: Rol;
  activo: boolean;
}

// ---------- Panel de inicio ----------

export interface Alerta {
  tipo: 'diagnostico_sin_revisar' | 'diagnostico_no_concluyente' | 'tratamiento_sin_seguimiento';
  nivel: 'advertencia' | 'informacion';
  mensaje: string;
  enlace: { recurso: 'diagnostico' | 'tratamiento'; id: number };
}

export interface Panel {
  rol: Rol;
  periodoDias: number;
  tarjetas: {
    fincas: number;
    parcelas: number;
    diagnosticosPeriodo: number;
    pendientesRevision: number;
    tratamientosActivos: number;
    informesEmitidos: number;
    informesBorrador?: number; // solo técnico y administrador
    enfermedadMasFrecuente: { enfermedad: string; casos: number } | null;
  };
  distribucion: { enfermedad: string; codigo: string; esSana: boolean; casos: number }[];
  ultimosDiagnosticos: {
    id: number;
    fecha: string;
    finca: string;
    parcelaId: number;
    parcela: string;
    enfermedad: string;
    codigo: string;
    confianza: number;
    estado: 'pendiente' | 'confirmado' | 'corregido';
  }[];
  alertas: Alerta[];
  usuariosPorRol?: { rol: Rol; activos: number; inactivos: number }[]; // solo administrador
}
