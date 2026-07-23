# Península — Solicitudes de ingreso

Formulario + dashboard admin + notificación por FormSubmit.

## Local

```bash
npm install
cp .env.example .env   # completa VITE_FORMSUBMIT_ID
npm run dev
```

## Despliegue en Dokploy

El repo está listo para **Nixpacks** o **Dockerfile**.

### Opción A — Nixpacks (recomendado en Dokploy)

1. Crea una app en Dokploy → Provider **GitHub** → repo `SOLNO-TECH/peninsula-sistema`
2. Build Pack: **Nixpacks** (usa `nixpacks.toml`)
3. Variables de entorno (también como **Build-time**, porque Vite las embebe al compilar):

| Variable | Ejemplo |
|----------|---------|
| `VITE_NOTIFY_EMAIL` | `proveedores@peninsulanvo.com` |
| `VITE_FORMSUBMIT_ID` | tu hash de FormSubmit |

4. Puerto: **3000** (o el que Dokploy asigne con `$PORT`)
5. Deploy

### Opción B — Dockerfile + Nginx

1. En Dokploy elige build type **Dockerfile**
2. Pasa los mismos `VITE_*` como **build args / env de build**
3. Puerto expuesto: **80**
4. Deploy

### Importante

- Las variables `VITE_*` se usan en el **build**, no solo en runtime.
- Tras cambiar env, haz **Rebuild** (no solo restart).
- FormSubmit: si el dominio de producción es nuevo, puede pedir reactivar el formulario una vez.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Formulario |
| `/email-preview` | Vista previa correo |
| `/admin/login` | Login |
| `/admin` | Dashboard |

## Admin

- Usuario: `admin`
- Contraseña: `peninsula2026`
