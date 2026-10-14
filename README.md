# QuestLog · Notion Gaming

App de notas y tareas al estilo Notion con mecánicas de juego: Zonas (páginas), Misiones con rareza, XP, niveles, rachas y logros. Estilo neón cyberpunk.

## Desarrollo

```bash
npm install
npm run dev     # servidor local en http://localhost:5173
npm test        # tests (Vitest)
npm run build   # build de producción en dist/
```

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Guardado local (localStorage) en Fase 0; Supabase para cuentas y sincronización en Fase 2
- Despliegue automático a GitHub Pages con GitHub Actions al fusionar en `main`

## Hoja de ruta

1. **Fase 0:** base visual, layout con sidebar y HUD de XP, despliegue automático
2. **Fase 1:** Zonas con editor de bloques, árbol de páginas, misiones, guardado local
3. **Fase 2:** login y sincronización entre dispositivos (Supabase)
4. **Fase 3:** Quest Board (kanban), rachas y logros
5. **Fase 4:** PWA instalable, sonidos, temas, búsqueda rápida, plantillas
