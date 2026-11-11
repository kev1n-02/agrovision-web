// =====================================================================
// Interceptor: se ejecuta en TODAS las peticiones HTTP.
// 1. Agrega "Authorization: Bearer <token>" a las peticiones a la API.
// 2. Si la API responde 401 (sesión vencida o usuario desactivado),
//    cierra la sesión y lleva al login.
// =====================================================================
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from '../servicios/auth.service';

export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const auth = inject(AuthService);
  const token = auth.token();

  const conToken = token && peticion.url.startsWith(API_URL)
    ? peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : peticion;

  return siguiente(conToken).pipe(
    catchError((error: HttpErrorResponse) => {
      // En el login, un 401 significa "correo o contraseña incorrectos": no se cierra nada.
      if (error.status === 401 && !peticion.url.endsWith('/auth/login')) {
        auth.cerrarSesion('expirada');
      }
      return throwError(() => error);
    }),
  );
};
