# Gestión de Financiamiento

Primer módulo implementado: autenticación de usuarios con Next.js 16, Better Auth, Prisma 7 y PostgreSQL.

## Stack del módulo

- Next.js `16.2.4` con `App Router`
- TypeScript
- Tailwind CSS `v4`
- shadcn/ui
- Sonner para notificaciones
- Zod para validaciones
- Better Auth `1.6.9`
- Prisma `7.0.1`
- PostgreSQL

## Qué incluye

- Login por correo y contraseña.
- Protección de rutas con `proxy.ts` para redirección optimista.
- Verificación segura de sesión en páginas y server actions.
- Super Admin con panel exclusivo para crear usuarios.
- Contraseña provisional con cambio obligatorio al primer ingreso.
- Seed opcional para crear el primer Super Admin.
- Base preparada para extender luego a organizaciones y equipos.

## Estructura de carpetas

```text
.
├── app
│   ├── actions
│   │   ├── admin-users.ts
│   │   ├── auth.ts
│   │   └── session.ts
│   ├── admin
│   │   ├── page.tsx
│   │   └── usuarios
│   │       └── page.tsx
│   ├── api
│   │   └── auth
│   │       └── [...all]
│   │           └── route.ts
│   ├── cambiar-contrasena
│   │   └── page.tsx
│   ├── login
│   │   └── page.tsx
│   ├── panel
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── admin
│   │   └── create-user-form.tsx
│   ├── auth
│   │   ├── change-password-form.tsx
│   │   └── login-form.tsx
│   ├── shared
│   │   ├── field-error.tsx
│   │   ├── sign-out-button.tsx
│   │   └── submit-button.tsx
│   └── ui
├── lib
│   ├── auth-client.ts
│   ├── auth-helpers.ts
│   ├── auth.ts
│   ├── env.ts
│   ├── form-state.ts
│   ├── prisma.ts
│   └── validations
│       └── auth.ts
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
├── prisma.config.ts
└── proxy.ts
```

## Variables de entorno

Crear `.env` a partir de `.env.example`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gestion_financiamiento?schema=public"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
SUPER_ADMIN_EMAIL="admin@example.com"
SUPER_ADMIN_PASSWORD="ChangeMe123!"
SUPER_ADMIN_NAME="Super Admin"
```

Notas:

- `BETTER_AUTH_SECRET` debe ser largo y aleatorio.
- `BETTER_AUTH_URL` debe apuntar a la URL real donde corre la app.
- `SUPER_ADMIN_*` solo se usa para el seed inicial.

## Comandos

```bash
npm install
npm run db:generate
npm run dev
```

Para aplicar la migración en una base PostgreSQL real:

```bash
npm run db:migrate -- --name init_auth
```

Para crear el Super Admin inicial:

```bash
npm run db:seed
```

## Flujo funcional

### 1. Login

- El usuario inicia sesión con correo y contraseña.
- Better Auth crea la sesión y escribe cookies seguras.
- El sistema redirige según estado:
  - `mustChangePassword = true` -> `/cambiar-contrasena`
  - `role = admin` -> `/admin/usuarios`
  - resto -> `/panel`

### 2. Cambio obligatorio de contraseña

- Los usuarios creados por el admin nacen con `mustChangePassword = true`.
- En el primer ingreso deben cambiar la contraseña.
- Después del cambio, el sistema actualiza `mustChangePassword = false`.

### 3. Alta de usuarios por Super Admin

- Solo el rol `admin` accede a `/admin/usuarios`.
- El formulario solicita únicamente:
  - correo
  - contraseña provisional
- El nombre se deriva automáticamente desde el correo para cumplir el esquema requerido por Better Auth.

## Prisma 7: puntos importantes de esta implementación

- Se usa `prisma.config.ts` porque en Prisma 7 la URL ya no debe vivir en `schema.prisma`.
- El generador es `prisma-client` con `output` explícito en `generated/prisma`.
- El cliente se importa desde `@/generated/prisma/client`, no desde `@prisma/client`.
- Para PostgreSQL se usa `@prisma/adapter-pg` + `pg`, porque Prisma 7 requiere driver adapter para conexión directa.

## Better Auth: puntos importantes de esta implementación

- Se usa `nextCookies()` para que los server actions puedan propagar correctamente cookies de sesión en Next.js.
- Se usa el plugin `admin()` para manejar creación de usuarios con hashing y cuentas credenciales compatibles con Better Auth.
- El hash de contraseña queda en el formato estándar de Better Auth basado en `scrypt` (`s2:salt:hash`).
- `proxy.ts` solo hace controles optimistas con la cookie cacheada; las validaciones seguras siguen haciéndose dentro de páginas y server actions.

## Notas sobre versiones y alternativas

- Next.js `16.2.4`: se usa `proxy.ts` en vez de `middleware.ts`, según la documentación oficial de Next 16.
- Prisma `7.0.1`: esta versión cambia tanto el generador como la configuración de datasource y la forma de instanciar el cliente.
- Better Auth `1.6.9`: compatible con Next 16 y con Prisma 7 según su documentación oficial.
- Alternativa posible:
  - Si más adelante usas Prisma Accelerate, la inicialización de `lib/prisma.ts` cambia y ya no se usa `PrismaPg`.
  - Si necesitas roles más granulares que `admin/user`, el plugin `admin` permite extender roles o se puede introducir una capa ACL adicional.

## Seguridad y buenas prácticas aplicadas

- Sign up público deshabilitado.
- Validación de formularios con Zod en servidor.
- Rutas protegidas con doble capa:
  - optimista en `proxy.ts`
  - segura en server components y server actions
- Cookie cache habilitada para redirección rápida sin depender de consultas pesadas en proxy.
- Reutilización de helpers de sesión para evitar lógica duplicada.

## Siguientes módulos recomendados

1. Gestión avanzada de usuarios: edición, baja lógica, reseteo de contraseña.
2. Organizaciones y equipos con Better Auth.
3. Permisos por módulo/acción.
4. Auditoría de accesos y actividad administrativa.
