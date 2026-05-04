# 📅 Memorias

Calendario interactivo de fotos para niños. Los días con fotos brillan con colores candy; al hacer clic aparecen las fotos de ese día.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Django 5 + DRF |
| Frontend | React 18 + Vite + Tailwind + Framer Motion |
| Base de datos | PostgreSQL 16 |
| Infraestructura | Docker Compose |

## Arrancar el proyecto

```bash
# 1. Clonar / posicionarse en el directorio
cd memorias

# 2. Levantar todo
docker compose up --build

# 3. En otra terminal — migraciones (solo primera vez)
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

## URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:8000/api/ |
| Admin Django | http://localhost:8000/admin/ |

## Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/photos/?date=YYYY-MM-DD` | Fotos de un día |
| GET | `/api/photos/calendar/?year=YYYY&month=MM` | Días con fotos |
| POST | `/api/photos/upload/` | Subir foto (multipart) |

## Subir fotos de prueba (curl)

```bash
curl -X POST http://localhost:8000/api/photos/upload/ \
  -F "image=@foto.jpg" \
  -F "taken_at=2024-07-15" \
  -F "title=Cumpleaños de Sofía"
```

## Estructura del proyecto

```
memorias/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── memorias/          # config Django
│   │   ├── settings.py
│   │   └── urls.py
│   └── photos/            # app principal
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── api.js
        ├── index.css
        └── components/
            ├── Calendar.jsx
            └── PhotoModal.jsx
```
