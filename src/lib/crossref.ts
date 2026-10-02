/**
 * Build-time cross-reference checks.
 *
 * A YAML record can name a user group by slug (`user_groups:` on an event,
 * `parent_user_group:` on a student builder group). Nothing stops that slug from
 * being wrong, and a wrong one would render a link to a page that does not
 * exist. These helpers turn that into a build failure with a readable message.
 */

export function resolveGroups<T extends { id: string }>(
  referenced: string[],
  groups: T[],
  context: string,
): T[] {
  const byId = new Map(groups.map((group) => [group.id, group]));
  const missing = referenced.filter((slug) => !byId.has(slug));

  if (missing.length > 0) {
    throw new Error(
      `${context}: user group slug(s) ${missing
        .map((slug) => `"${slug}"`)
        .join(', ')} do not exist in content/user-groups/`,
    );
  }

  return referenced.map((slug) => byId.get(slug)!);
}

export function resolveGroup<T extends { id: string }>(
  referenced: string | null,
  groups: T[],
  context: string,
): T | null {
  if (!referenced) return null;
  const [resolved] = resolveGroups([referenced], groups, context);
  return resolved;
}
