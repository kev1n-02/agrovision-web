// =====================================================================
// Avisos flotantes ("toasts") para confirmar acciones o mostrar errores.
// Uso desde cualquier pantalla:
//   this.avisos.exito('Finca registrada.');
//   this.avisos.error('No se pudo guardar.');
// =====================================================================
import { Injectable, signal } from '@angular/core';

export interface Aviso {
  id: number;
  tipo: 'exito' | 'error';
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class AvisosService {
  readonly lista = signal<Aviso[]>([]);
  private siguienteId = 1;

  exito(texto: string): void {
    this.mostrar('exito', texto, 4000);
  }

  /** Los errores se quedan más tiempo, para alcanzar a leerlos. */
  error(texto: string): void {
    this.mostrar('error', texto, 7000);
  }

  cerrar(id: number): void {
    this.lista.update((avisos) => avisos.filter((a) => a.id !== id));
  }

  private mostrar(tipo: Aviso['tipo'], texto: string, duracionMs: number): void {
    const id = this.siguienteId++;
    this.lista.update((avisos) => [...avisos, { id, tipo, texto }]);
    setTimeout(() => this.cerrar(id), duracionMs);
  }
}
