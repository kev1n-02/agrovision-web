// =====================================================================
// Pantalla de inicio de sesión.
// Valida en el navegador (campos vacíos, formato de correo) y muestra
// los mensajes que devuelve la API (correo o contraseña incorrectos).
// =====================================================================
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/servicios/auth.service';
import { leerError } from '../../core/errores';

type Campo = 'correo' | 'contrasena';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);

  readonly cargando = signal(false);
  readonly verContrasena = signal(false);
  readonly errorGeneral = signal<string | null>(null);
  readonly erroresServidor = signal<Partial<Record<Campo, string>>>({});

  /** Aviso cuando la API cerró la sesión (token vencido o usuario desactivado). */
  readonly aviso = this.ruta.snapshot.queryParamMap.get('motivo') === 'expirada'
    ? 'Su sesión terminó. Inicie sesión nuevamente.'
    : null;

  readonly formulario = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required]],
  });

  constructor() {
    // Si ya hay sesión, no tiene sentido mostrar el login.
    if (this.auth.haySesion()) {
      this.router.navigate(['/inicio']);
    }
  }

  /** Mensaje de error de un campo: primero el del navegador, luego el de la API. */
  errorDe(campo: Campo): string | null {
    const control = this.formulario.controls[campo];
    if (control.touched && control.errors) {
      if (control.errors['required']) return campo === 'correo' ? 'Ingrese su correo.' : 'Ingrese su contraseña.';
      if (control.errors['email']) return 'El correo no tiene un formato válido.';
    }
    return this.erroresServidor()[campo] ?? null;
  }

  ingresar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // muestra los mensajes de todos los campos
      return;
    }
    this.cargando.set(true);
    this.errorGeneral.set(null);
    this.erroresServidor.set({});

    const { correo, contrasena } = this.formulario.getRawValue();
    this.auth.iniciarSesion(correo.trim(), contrasena).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: (error) => {
        const detalle = leerError(error);
        this.errorGeneral.set(detalle.mensaje);
        this.erroresServidor.set(detalle.campos);
        this.cargando.set(false);
      },
    });
  }
}
