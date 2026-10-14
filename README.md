# Notion Gaming

App de tareas al estilo Notion con estética de videojuego retro (pixel art).

## Estado

- Paso 1: tareas diarias (añadir, marcar y eliminar), guardadas en el navegador.
- **Paso 2:** clasificaciones con color e icono (universidad, trabajo, vida diaria, freelance y las que crees).
- Paso 3: calendario con filtro por clasificación.
- Paso 4: cards con el número de tareas por clasificación.

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
