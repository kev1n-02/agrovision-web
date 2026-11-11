// =====================================================================
// Página de inicio: muestra el panel que arma la API (GET /panel).
// Orden pensado para el trabajo diario:
//   1. Por atender (alertas)   2. Cifras del periodo
//   3. Qué se está diagnosticando   4. Últimos diagnósticos
// =====================================================================
import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/servicios/auth.service';
import { PanelService } from '../../core/servicios/panel.service';
import { Alerta, Panel } from '../../core/modelos';
import { NOMBRE_ESTADO_DIAGNOSTICO, NOMBRE_ROL, colorEnfermedad } from '../../core/enfermedades';
import { leerError } from '../../core/errores';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  readonly auth = inject(AuthService);
  private readonly panelServicio = inject(PanelService);

  readonly periodos = [7, 30, 90];
  readonly dias = signal(30);
  readonly panel = signal<Panel | null>(null);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  // Funciones y textos que usa la plantilla
  readonly colorEnfermedad = colorEnfermedad;
  readonly nombreEstado = NOMBRE_ESTADO_DIAGNOSTICO;
  readonly nombreRol = NOMBRE_ROL;

  readonly saludo = computed(() => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  });

  /** Total de diagnósticos del periodo (para los porcentajes de la distribución). */
  readonly totalCasos = computed(() => (this.panel()?.distribucion ?? []).reduce((suma, d) => suma + d.casos, 0));

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.panelServicio.obtener(this.dias()).subscribe({
      next: (panel) => {
        this.panel.set(panel);
        this.cargando.set(false);
      },
      error: (error) => {
        this.error.set(leerError(error).mensaje);
        this.cargando.set(false);
      },
    });
  }

  cambiarPeriodo(dias: number): void {
    if (dias === this.dias()) return;
    this.dias.set(dias);
    this.cargar();
  }

  porcentaje(casos: number): number {
    const total = this.totalCasos();
    return total === 0 ? 0 : Math.round((casos / total) * 100);
  }

  /** 0.9946 → "99,5 %" */
  confianza(valor: number): string {
    return `${(valor * 100).toLocaleString('es-EC', { maximumFractionDigits: 1 })} %`;
  }

  iconoAlerta(alerta: Alerta): string {
    if (alerta.tipo === 'tratamiento_sin_seguimiento') return 'bi-clipboard2-pulse';
    if (alerta.tipo === 'diagnostico_no_concluyente') return 'bi-question-circle';
    return 'bi-hourglass-split';
  }
}
