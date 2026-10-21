# KENDY APK STUDIO — Módulo 1 (frontend/index.html + backend)

## Requisitos
Docker + Docker Compose (o Node 20, PostgreSQL 16 y el paquete `aapt`).

## Arranque
    cp .env.example .env
    docker compose up --build

## Usar
Abre http://localhost:3000 (el backend sirve `frontend/index.html`).
Si alojas `index.html` en otro sitio: define `CORS_ORIGIN` en el backend y pon la URL del backend en Configuración.

## Probar por API
    curl -F file=@mi.apk http://localhost:3000/api/projects
    curl http://localhost:3000/api/projects
    curl "http://localhost:3000/api/projects/<id>/files?q=ic_launcher"
    curl http://localhost:3000/api/projects/<id>/icon -o icon.png

## Estado
Implementado: subida con límite de tamaño, validación ZIP anti zip-slip/zip bomb, lectura del manifiesto con aapt,
almacenamiento local, metadatos en PostgreSQL, listado/búsqueda de archivos, icono PNG/WebP, borrado.
Pendiente: S3, autenticación (hoy owner_id='local'), editor, reemplazo de recursos, worker (Apktool/firma),
versiones y enlaces. Iconos adaptativos XML y manifiesto legible requieren Apktool (módulo 4).

## Errores frecuentes
- "No se pudo leer el manifiesto con aapt": instala `aapt` o ajusta AAPT_BIN.
- 413: sube MAX_APK_MB.
