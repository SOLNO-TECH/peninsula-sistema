# Península — Solicitudes de ingreso

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Formulario público |
| `/email-preview` | Vista previa del diseño de correo |
| `/admin/login` | Login admin |
| `/admin` | Dashboard |

## Correo (FormSubmit → Outlook)

Al enviar el formulario se manda a `proveedores@peninsulanvo.com` vía FormSubmit.

En `.env`:

```
VITE_NOTIFY_EMAIL=proveedores@peninsulanvo.com
VITE_FORMSUBMIT_ID=tu_hash_de_activacion
```

El hash es el que te envió FormSubmit al activar (ej. `947a13b16e5fd4d060237f1972ef3bc4`).

Los datos van en un bloque compacto para que el correo no se vea tan largo.

## Credenciales admin

- **Usuario:** `admin`
- **Contraseña:** `peninsula2026`
