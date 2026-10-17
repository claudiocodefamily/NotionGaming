# Conduce un poco

App de tareas al estilo Notion con estética de videojuego retro (pixel art).

## Estado

- Paso 1: tareas diarias (añadir, marcar y eliminar), guardadas en el navegador.
- Paso 2: clasificaciones con color e icono (universidad, trabajo, vida diaria, freelance y las que crees).
- Paso 3: calendario mensual con filtro por clasificación; permite ver y añadir tareas de cualquier día.
- **Extra:** tareas macro con subtareas (la macro se completa sola al terminar sus subtareas) y columna de pendientes agrupada por clasificación, desplegable.
- **Extra:** misiones secundarias, tareas sin fecha que se pasan a hoy con un clic.
- **Extra:** la pestaña Tareas es una columna con pendientes del día, próximos pendientes (por fecha) y misiones secundarias; al marcar una tarea baja al final de su lista. El centro es para crear tareas, con un minicalendario de la semana (sábado a viernes) para elegir el día.
- **Extra:** nuevo nombre, *Conduce un poco*; pantalla negra arriba (donde irá el viaje) y tablero del auto con kilometraje (1 km por tarea o subtarea completada), gasolina (por ahora llena), emisora y llaves para encender o apagar.
- Paso 4: cards con el número de tareas por clasificación.
- Paso 5 (más adelante): header estilo *Keep Driving*, con un auto pixel art que avanza por distintos escenarios y paneles debajo (gasolina, kilometraje).
  - Cada tarea cumplida hace avanzar el auto; los kilómetros son el progreso real.
  - Modo focus como "gasolina": concentrarse llena el tanque y permite avanzar más rápido.
  - Los kilómetros acumulados completan eventos y desbloquean lugares, autos y personalización del personaje.
  - Primera entrega: solo el header con el auto avanzando al completar tareas.

## Ejecutarla en tu PC

Necesitas [Node.js](https://nodejs.org) 20 o superior y [Git](https://git-scm.com).

```bash
git clone https://github.com/claudiocodefamily/NotionGaming.git
cd NotionGaming
npm install
npm run dev
```

Abre http://localhost:5173 en el navegador. Las tareas se guardan en ese navegador.

## Otros comandos

```bash
npm test        # tests
npm run lint    # revisión de código
npm run build   # versión de producción en dist/
```
