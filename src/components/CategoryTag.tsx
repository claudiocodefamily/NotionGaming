import type { Category } from '../categories/categories'

/** Etiqueta pequeña con icono y nombre de la clasificación, en su color. */
export function CategoryTag({ category }: { category: Category }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 border-2 px-1.5 text-[18px] leading-tight"
      style={{ borderColor: category.color, color: category.color, background: `${category.color}1a` }}
    >
      <span aria-hidden>{category.icon}</span>
      {category.name}
    </span>
  )
}
