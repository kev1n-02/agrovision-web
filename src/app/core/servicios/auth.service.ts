// =====================================================================
// Servicio de sesión.
// - Inicia sesión contra la API y guarda el token en sessionStorage
//   (se borra al cerrar el navegador).
// - Expone el usuario conectado como "signal": cualquier pantalla que lo
//   use se actualiza sola cuando cambia.
// =====================================================================
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { Respuesta, Rol, Usuario } from '../modelos';

const CLAVE_TOKEN = 'agv_token';
const CLAVE_USUARIO = 'agv_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /** Usuario conectado (null si no hay sesión). */
  readonly usuario = signal<Usuario | null>(this.leerUsuarioGuardado());

  /**
   * true si hay usuario y su token sigue vigente.
   * Es un método (no computed) porque la hora cambia: se revisa cada vez que se llama.
   */
  haySesion(): boolean {
    return this.usuario() !== null && this.tokenVigente();
  }

  /** Primer nombre, para el saludo. */
  readonly primerNombre = computed(() => this.usuario()?.nombres.split(' ')[0] ?? '');

  iniciarSesion(correo: string, contrasena: string): Observable<Usuario> {
    return this.http
      .post<Respuesta<{ token: string; usuario: Usuario }>>(`${API_URL}/auth/login`, { correo, contrasena })
      .pipe(
        map((respuesta) => {
          this.guardar(CLAVE_TOKEN, respuesta.data.token);
          this.guardar(CLAVE_USUARIO, JSON.stringify(respuesta.data.usuario));
          this.usuario.set(respuesta.data.usuario);
          return respuesta.data.usuario;
        }),
      );
  }

  /** Borra la sesión y vuelve al login. motivo='expirada' muestra un aviso. */
  cerrarSesion(motivo?: 'expirada'): void {
    this.borrar(CLAVE_TOKEN);
    this.borrar(CLAVE_USUARIO);
    this.usuario.set(null);
    this.router.navigate(['/login'], { queryParams: motivo ? { motivo } : {} });
  }

  token(): string | null {
    try {
      return sessionStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null; // navegación privada o almacenamiento bloqueado
    }
  }

  tieneRol(...roles: Rol[]): boolean {
    const usuario = this.usuario();
    return usuario !== null && roles.includes(usuario.rol);
  }

  /**
   * Lee la fecha de expiración (exp) dentro del token. El token tiene tres
   * partes separadas por puntos; la del medio es JSON en base64.
   * Solo sirve para no mostrar pantallas con un token vencido: la API
   * igual verifica la firma en cada petición.
   */
  private tokenVigente(): boolean {
    const token = this.token();
    if (!token) return false;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const datos = JSON.parse(atob(base64)) as { exp?: number };
      return !datos.exp || datos.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private leerUsuarioGuardado(): Usuario | null {
    try {
      const texto = sessionStorage.getItem(CLAVE_USUARIO);
      return texto ? (JSON.parse(texto) as Usuario) : null;
    } catch {
      return null;
    }
  }

  private guardar(clave: string, valor: string): void {
    try {
      sessionStorage.setItem(clave, valor);
    } catch {
      // Si el navegador no permite guardar, la sesión dura mientras la pestaña esté abierta.
    }
  }

  private borrar(clave: string): void {
    try {
      sessionStorage.removeItem(clave);
    } catch {
      // nada que borrar
    }
  }
}
