// =====================================================================
// Convierte un error HTTP en un mensaje para el usuario.
// La API responde: { ok: false, mensaje: '...', errores: [{ campo, mensaje }] }
// Aquí se separa el mensaje general de los mensajes por campo, para
// mostrar cada uno debajo de su input en los formularios.
// =====================================================================
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorApi {
  mensaje: string;
  campos: Record<string, string>;
}

export function leerError(error: unknown): ErrorApi {
  if (error instanceof HttpErrorResponse) {
    // status 0 = no hubo respuesta: la API está apagada o no hay red.
    if (error.status === 0) {
      return { mensaje: 'No se pudo conectar con el servidor. Verifique que la API esté encendida.', campos: {} };
    }
    const cuerpo = error.error as { mensaje?: string; errores?: { campo: string; mensaje: string }[] } | null;
    const campos: Record<string, string> = {};
    for (const e of cuerpo?.errores ?? []) {
      campos[e.campo] = e.mensaje;
    }
    return { mensaje: cuerpo?.mensaje ?? 'Ocurrió un error inesperado. Intente nuevamente.', campos };
  }
  return { mensaje: 'Ocurrió un error inesperado. Intente nuevamente.', campos: {} };
}
