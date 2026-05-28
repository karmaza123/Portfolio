import type { ProjectFilterCategory } from "../constants/projectFilters";
import type { HomeProject } from "../data/homeProjects";

export { PROJECT_FILTER_CATEGORIES, type ProjectFilterCategory } from "../constants/projectFilters";

export function filterProjectsByCategory(
  projects: readonly HomeProject[],
  category: ProjectFilterCategory | null,
): HomeProject[] {
  if (!category) return [...projects];
  return projects.filter((p) => p.categories.includes(category));
}
