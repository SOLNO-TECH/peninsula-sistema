# Peninsula - Solicitudes de ingreso

Formulario bilingue (ES/EN) + dashboard admin/lobby + FormSubmit.
Las solicitudes se guardan en el servidor (archivo JSON en un volume).

## Local

```bash
npm install
cp .env.example .env   # completa VITE_FORMSUBMIT_ID
npm run dev:server     # API en :3000 (otra terminal)
npm run dev            # Vite en :5173 (proxy /api -> :3000)
```

## Despliegue en Dokploy

1. Build type: **Dockerfile** (recomendado) o Nixpacks
2. Dockerfile path: `Dockerfile` / context: `.`
3. Puerto: **3000**
4. Volume mount: `/data`
5. Variables:

| Variable | Tipo | Ejemplo |
|----------|------|---------|
| `VITE_NOTIFY_EMAIL` | build | `proveedores@peninsulanvo.com` |
| `VITE_FORMSUBMIT_ID` | build | hash FormSubmit |
| `VITE_NOTIFY_EXTRA_EMAILS` | build | `recepcion@peninsulanvo.com` |
| `DATA_DIR` | runtime | `/data` |
| `ADMIN_USER` | runtime | `admin` |
| `ADMIN_PASSWORD` | runtime | tu contrasena |
| `LOBBY_USER` | runtime | `lobby` |
| `LOBBY_PASSWORD` | runtime | tu contrasena lobby |

Tras cambiar `VITE_*`, haz **Rebuild**.

## Rutas

| Ruta | Descripcion |
|------|-------------|
| `/` | Formulario ES/EN |
| `/admin/login` | Login |
| `/admin` | Dashboard |

## Usuarios (por defecto)

| Rol | Usuario | Contrasena | Permisos |
|-----|---------|------------|----------|
| Admin | `admin` | `peninsula2026` | Ver + aprobar/rechazar/eliminar |
| Lobby | `lobby` | `lobby2026` | Solo ver solicitudes |

## Correos

Cada envio notifica a:
- `proveedores@peninsulanvo.com` (o hash FormSubmit)
- `recepcion@peninsulanvo.com` (extra)

Si FormSubmit pide activar un correo nuevo, hay que confirmar el link la primera vez.
