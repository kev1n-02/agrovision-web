// =====================================================================
// Estructura principal (después del login):
//   - Computador: barra lateral verde con el menú y el usuario.
//   - Celular: barra inferior con las secciones principales y un botón
//     central "Diagnosticar"; el resto está en "Más".
// El menú se arma según el rol del usuario conectado.
// =====================================================================
import { Component, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/servicios/auth.service';
import { NOMBRE_ROL } from '../core/enfermedades';
import { Rol } from '../core/modelos';
import { Avisos } from '../compartido/avisos/avisos';

interface ItemMenu {
  ruta: string;
  texto: string;
  icono: string;
  roles?: Rol[];       // si no se indica, lo ven todos
  disponible: boolean; // false = pantalla aún no construida
  enBarraMovil: boolean;
}

@Component({
  selector: 'app-estructura',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet, Avisos],
  templateUrl: './estructura.html',
  styleUrl: './estructura.css',
})
export class Estructura {
  readonly auth = inject(AuthService);
  readonly masAbierto = signal(false);

  // Se marca "disponible: true" a medida que se construye cada pantalla.
  private readonly items: ItemMenu[] = [
    { ruta: '/inicio', texto: 'Inicio', icono: 'bi-house', disponible: true, enBarraMovil: true },
    { ruta: '/fincas', texto: 'Fincas', icono: 'bi-tree', disponible: false, enBarraMovil: true },
    { ruta: '/diagnosticos', texto: 'Diagnósticos', icono: 'bi-camera', disponible: false, enBarraMovil: false },
    { ruta: '/tratamientos', texto: 'Tratamientos', icono: 'bi-clipboard2-pulse', disponible: false, enBarraMovil: false },
    { ruta: '/informes', texto: 'Informes', icono: 'bi-file-earmark-text', disponible: false, enBarraMovil: true },
    { ruta: '/catalogo', texto: 'Catálogo', icono: 'bi-journal-bookmark', roles: ['ADMINISTRADOR', 'TECNICO'], disponible: false, enBarraMovil: false },
    { ruta: '/usuarios', texto: 'Usuarios', icono: 'bi-people', roles: ['ADMINISTRADOR'], disponible: false, enBarraMovil: false },
    { ruta: '/bitacora', texto: 'Bitácora', icono: 'bi-list-check', roles: ['ADMINISTRADOR'], disponible: false, enBarraMovil: false },
  ];

  /** Opciones que el rol actual puede ver. */
  readonly menu = computed(() => {
    const usuario = this.auth.usuario();
    return this.items.filter((i) => !i.roles || (usuario !== null && i.roles.includes(usuario.rol)));
  });

  readonly menuMovil = computed(() => this.menu().filter((i) => i.enBarraMovil));
  readonly menuMas = computed(() => this.menu().filter((i) => !i.enBarraMovil));

  readonly nombreRol = computed(() => {
    const usuario = this.auth.usuario();
    return usuario ? NOMBRE_ROL[usuario.rol] : '';
  });

  /** Iniciales para el botón de usuario en el celular (ej.: "KY"). */
  readonly iniciales = computed(() => (this.auth.usuario()?.nombres ?? '')
    .split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join(''));

  cerrarSesion(): void {
    this.masAbierto.set(false);
    this.auth.cerrarSesion();
  }
}
