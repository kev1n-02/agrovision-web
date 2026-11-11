// =====================================================================
// Muestra los avisos flotantes (abajo a la derecha). Va una sola vez,
// dentro de la estructura principal (layout).
// =====================================================================
import { Component, inject } from '@angular/core';
import { AvisosService } from '../../core/servicios/avisos.service';

@Component({
  selector: 'app-avisos',
  template: `
    <div class="avisos" aria-live="polite">
      @for (aviso of avisos.lista(); track aviso.id) {
        <div class="aviso" [class.aviso-error]="aviso.tipo === 'error'" role="status">
          <i class="bi" [class.bi-check-circle-fill]="aviso.tipo === 'exito'"
             [class.bi-exclamation-octagon-fill]="aviso.tipo === 'error'" aria-hidden="true"></i>
          <span>{{ aviso.texto }}</span>
          <button type="button" class="btn-close btn-close-white" aria-label="Cerrar aviso"
                  (click)="avisos.cerrar(aviso.id)"></button>
        </div>
      }
    </div>
  `,
  styles: `
    .avisos {
      position: fixed; right: 1rem; bottom: 1rem; z-index: 1080;
      display: flex; flex-direction: column; gap: .5rem; max-width: min(24rem, calc(100vw - 2rem));
    }
    .aviso {
      display: flex; align-items: flex-start; gap: .6rem;
      background: var(--agv-hoja-oscura); color: #fff;
      padding: .75rem .9rem; border-radius: .5rem; box-shadow: 0 6px 18px rgba(31, 65, 40, .25);
    }
    .aviso span { flex: 1; line-height: 1.35; }
    .aviso-error { background: var(--agv-manzana); }
    .aviso .bi { font-size: 1.1rem; margin-top: .05rem; }
    @media (max-width: 991.98px) { .avisos { bottom: 5.5rem; } } /* encima de la barra inferior */
  `,
})
export class Avisos {
  readonly avisos = inject(AvisosService);
}
