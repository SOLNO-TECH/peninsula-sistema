# Península — Solicitudes de ingreso

Formulario + dashboard admin + notificación por FormSubmit.
Las solicitudes se guardan en el servidor (archivo JSON en un volume).

## Local

```bash
npm install
cp .env.example .env   # completa VITE_FORMSUBMIT_ID
npm run dev:server     # API en :3000 (otra terminal)
npm run dev            # Vite en :5173 (proxy /api → :3000)
```

Producción local:

```bash
npm run build
npm start
```

## Despliegue en Dokploy

### Nixpacks

1. App → GitHub → `SOLNO-TECH/peninsula-sistema`
2. Build Pack: **Nixpacks**
3. Puerto: **3000**
4. **Volume** (obligatorio para no perder datos):
   - Mount path: `/data`
5. Variables:

| Variable | Tipo | Ejemplo |
|----------|------|---------|
| `VITE_NOTIFY_EMAIL` | build | `proveedores@peninsulanvo.com` |
| `VITE_FORMSUBMIT_ID` | build | hash FormSubmit |
| `DATA_DIR` | runtime | `/data` |
| `ADMIN_USER` | runtime | `admin` |
| `ADMIN_PASSWORD` | runtime | tu contraseña |

6. Deploy / Rebuild

### Dockerfile

Igual: puerto **3000**, volume en `/data`, mismas variables.

### Importante

- `VITE_*` van en el **build**; tras cambiarlas, **Rebuild**.
- Sin volume, los datos se pierden al redesplegar.
- Credenciales admin ya no van en el frontend; solo en el servidor.

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/` | Formulario |
| `/admin/login` | Login |
| `/admin` | Dashboard |

## Admin (por defecto)

- Usuario: `admin`
- Contraseña: `peninsula2026` (cámbiala con `ADMIN_PASSWORD`)
