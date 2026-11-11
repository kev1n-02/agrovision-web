# AgroVision Web (Angular 21 + Bootstrap) · Etapa 1

Incluye: login, menú por rol (barra lateral en computador, barra inferior en celular) y página de inicio.

## Archivos de este paquete

```text
src/
├── styles.css                     (reemplaza el que crea Angular)
└── app/
    ├── app.routes.ts              (reemplaza el que crea Angular)
    ├── core/                      configuración, modelos, servicios, interceptor, guards
    ├── compartido/avisos/         avisos flotantes
    ├── estructura/                barra lateral, barra inferior y menú
    └── paginas/
        ├── login/
        └── inicio/
```

## Cambios a mano (3 archivos)

1. `angular.json` → en `"styles"`:
   ```json
   "styles": [
     "node_modules/bootstrap/dist/css/bootstrap.min.css",
     "node_modules/bootstrap-icons/font/bootstrap-icons.css",
     "src/styles.css"
   ]
   ```
2. `src/app/app.config.ts` → agregar `provideHttpClient(withInterceptors([authInterceptor]))` en `providers`.
3. `src/app/app.html` → dejar solo `<router-outlet />`.

Y en `src/index.html`, dentro de `<head>`, la fuente:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
```
