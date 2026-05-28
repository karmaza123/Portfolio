import type { ProjectFilterCategory } from "../utils/projectTags";

type ProjectTagFilterProps = {
  categories: readonly ProjectFilterCategory[];
  activeCategory: ProjectFilterCategory | null;
  onChange: (category: ProjectFilterCategory | null) => void;
};

export function ProjectTagFilter({ categories, activeCategory, onChange }: ProjectTagFilterProps) {
  return (
    <div className="mp-project-filters" role="group" aria-label="Filter projects by category">
      <button
        type="button"
        className={`mp-project-filter-btn${activeCategory === null ? " mp-project-filter-btn--active" : ""}`}
        aria-pressed={activeCategory === null}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`mp-project-filter-btn${activeCategory === category ? " mp-project-filter-btn--active" : ""}`}
          aria-pressed={activeCategory === category}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
