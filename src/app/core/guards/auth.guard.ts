// =====================================================================
// Guards: deciden si se puede entrar a una ruta.
//   sesionGuard   → solo con sesión iniciada (si no, al login)
//   rolGuard(...) → solo ciertos roles (si no, al inicio)
// Son una ayuda para la navegación: la seguridad real está en la API,
// que revisa el token y el rol en cada petición.
// =====================================================================
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Rol } from '../modelos';
import { AuthService } from '../servicios/auth.service';

export const sesionGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haySesion() ? true : router.createUrlTree(['/login']);
};

export function rolGuard(...roles: Rol[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.tieneRol(...roles) ? true : router.createUrlTree(['/inicio']);
  };
}
