// =====================================================================
// Consulta el panel de inicio: GET /api/v1/panel?dias=30
// =====================================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { Panel, Respuesta } from '../modelos';

@Injectable({ providedIn: 'root' })
export class PanelService {
  private readonly http = inject(HttpClient);

  obtener(dias: number): Observable<Panel> {
    return this.http
      .get<Respuesta<Panel>>(`${API_URL}/panel`, { params: { dias } })
      .pipe(map((respuesta) => respuesta.data));
  }
}
