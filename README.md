# 🚀 Signal Flow - Notificación Microservicios

**Signal Flow** es un microservicio de notificaciones construido con **NestJS**. Está diseñado para gestionar envíos de forma asíncrona, garantizando que la API principal nunca se bloquee, gracias a una arquitectura basada en eventos y colas de prioridad con **BullMQ**.

---

## 🏗️ Arquitectura del Sistema

El proyecto implementa un patrón **Producer-Consumer** (Productor-Consumidor) totalmente desacoplado:

1. **Dispatcher (Producer):**
   Recibe las solicitudes a través de una API REST protegida por **Rate Limiting** y validada con **DTOs**.  
   Una vez validada, la notificación se encola en **Redis**.

2. **Queue (BullMQ):**
   Gestiona la persistencia y el ciclo de vida de los trabajos, permitiendo reintentos automáticos y manejo de fallos sin pérdida de datos.

3. **Worker (Consumer):**
   Escucha la cola en segundo plano, compila plantillas dinámicas con **Handlebars** y despacha la notificación final a través de proveedores externos (como **Resend**).

---

## 🛠️ Stack Tecnológico

* **Framework:** [NestJS](https://nestjs.com/) (Node.js)
* **Lenguaje:** TypeScript
* **Base de Datos:** PostgreSQL & Prisma ORM
* **Gestión de Colas:** BullMQ & Redis
* **Plantillas de Email:** Handlebars (.hbs)
* **Seguridad:** Validación estricta de variables de entorno con **Joi**.
* **Rate Limiting** global para prevenir abusos de la API (5 req/min por IP).
* **Documentación:** Swagger 

---

## 🚀 Instalación y Setup

### 1. Requisitos Previos

- Docker y Docker Compose instalados.
- Node.js (v18 o superior).

### 2. Configuración

Clona el repositorio y crea tu archivo de entorno:

```bash
git clone https://github.com/FacundoNSantillan/SignalFlow.git
cd SignalFlow
cp .env.example .env
```
**Nota:** Asegúrate de completar las credenciales de `RESEND_API_KEY`, `DATABASE_URL` y los datos de acceso a Redis en tu archivo `.env` antes de continuar.

### 3. Levantar Infraestructura (Docker)
Este comando iniciará los contenedores de **PostgreSQL** y **Redis**, dejando el entorno de infraestructura listo:
```bash
docker-compose up -d
```

### 4. Preparar la Base de Datos
Para que el ORM (Prisma) reconozca tus modelos y la base de datos esté sincronizada, ejecutá:
```bash
npx prisma generate
npx prisma db push
```

### 5. Ejecutar la Aplicación
Instalá las dependencias de Node.js y lanzá el servidor en modo desarrollo:
```bash
npm install
npm run start:dev
```
---

## 📖 Documentación y Monitoreo

### Swagger UI (OpenAPI)
Explorá y probá los endpoints de forma interactiva. La documentación se genera automáticamente basándose en los DTOs y decoradores del código:
👉 `http://localhost:3000/api/docs`

### BullBoard (Dashboard de Colas)
Visualizá el estado en tiempo real. Podés ver jobs completados, fallidos o en espera, y reintentarlos manualmente si es necesario:
👉 `http://localhost:3000/admin/queues`

---

## 🧪 Testing

El proyecto incluye pruebas unitarias automatizadas con **Jest** para asegurar la integridad de la lógica y los servicios de infraestructura:

```bash
npm run test
```
---

## 📝 Próximos Pasos (Roadmap)
- [ ] **Soporte para Push Notifications:** Añadir Firebase Cloud Messaging (FCM) como nuevo proveedor.
- [ ] **Health Checks Endpoints:** Implementación de `/health` para monitorear el estado de Redis, PostgreSQL y la API.
- [ ] **Logging Avanzado:** Sustituir el logger por defecto por **Winston** o **Pino** para trazabilidad y archivos rotativos.
