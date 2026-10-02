import { defineCollection, z } from 'astro:content';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { load as parseYaml } from 'js-yaml';

/**
 * The content layer for content/**\/*.yml.
 *
 * A custom loader is used rather than the built-in glob loader so that the
 * filename/slug agreement is checked explicitly and a malformed file fails the
 * build with a readable message. scripts/validate_content.py still runs in CI
 * and remains the dependency-free check; these schemas are the same contract
 * expressed where the pages are rendered.
 */

const ROLES = [
  'lead',
  'co-lead',
  'mentor',
  'organizer',
  'co-organizer',
  'core-team',
  'unspecified',
] as const;

const GROUP_STATUSES = ['active', 'dormant', 'archived'] as const;
const EVENT_STATUSES = ['upcoming', 'active', 'archived'] as const;
const SBG_STATUSES = ['active', 'inactive', 'graduated'] as const;
const SCOPES = ['national', 'city'] as const;

/** Every URL in the content layer must be https://. */
const httpsUrl = z
  .string()
  .refine((value) => value.startsWith('https://'), {
    message: 'must be an https:// URL',
  });

const linkedInUrl = httpsUrl.refine(
  (value) => value.includes('linkedin.com/in/') || value.includes('linkedin.com/company/'),
  { message: 'must be a linkedin.com/in/ or linkedin.com/company/ URL' },
);

const person = z.object({
  name: z.string().min(1),
  role: z.enum(ROLES),
  label: z.string().nullable().default(null),
  linkedin: linkedInUrl.nullable().default(null),
  photo: z.string().nullable().default(null),
});

/** Event team members carry a free-text label rather than a normalised role. */
const teamMember = z.object({
  name: z.string().min(1),
  label: z.string().nullable().default(null),
  linkedin: linkedInUrl.nullable().default(null),
  photo: z.string().nullable().default(null),
});

const userGroup = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, digits and hyphens only'),
  name: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(1),
  status: z.enum(GROUP_STATUSES),
  logo: z.string().nullable().default(null),
  /** Path to the group's existing hand-written page, if it still has one. */
  page: z.string().nullable().default(null),
  links: z.object({
    linkedin: linkedInUrl.nullable().default(null),
    meetup: httpsUrl.nullable().default(null),
    instagram: httpsUrl.nullable().default(null),
    facebook: httpsUrl.nullable().default(null),
    x: httpsUrl.nullable().default(null),
  }),
  leaders: z.array(person).default([]),
  events: z.array(z.string()).default([]),
  notes: z.string().nullable().default(null),
  /** True when the record is knowingly incomplete and needs a human to confirm it. */
  needs_verification: z.boolean(),
  last_updated: z.coerce.date(),
});

const event = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, digits and hyphens only'),
  name: z.string().min(1),
  year: z.number().int(),
  status: z.enum(EVENT_STATUSES),
  /** community-day, hackathon, ... kept open so a new kind does not break the build. */
  kind: z.string().default('community-day'),
  scope: z.enum(SCOPES).nullable().default(null),
  city: z.string().nullable().default(null),
  venue: z.string().nullable().default(null),
  date: z.coerce.date().nullable().default(null),
  end_date: z.coerce.date().nullable().default(null),
  /** Slugs in content/user-groups/. Cross-checked at build time by the pages. */
  user_groups: z.array(z.string()).default([]),
  links: z
    .object({
      site: httpsUrl.nullable().default(null),
      registration: httpsUrl.nullable().default(null),
      call_for_speakers: httpsUrl.nullable().default(null),
      repository: httpsUrl.nullable().default(null),
      sessionize_widget_id: z.string().nullable().default(null),
    })
    .default({}),
  page: z.string().nullable().default(null),
  assets_dir: z.string().nullable().default(null),
  team: z.array(teamMember).default([]),
  notes: z.string().nullable().default(null),
  needs_verification: z.boolean(),
  last_updated: z.coerce.date(),
});

const studentBuilderGroup = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, digits and hyphens only'),
  university: z.string().min(1),
  short_name: z.string().nullable().default(null),
  city: z.string().min(1),
  status: z.enum(SBG_STATUSES),
  /** Academic year the listed leadership covers. */
  term: z.union([z.string(), z.number()]).nullable().default(null),
  logo: z.string().nullable().default(null),
  links: z
    .object({
      linkedin: linkedInUrl.nullable().default(null),
      community: httpsUrl.nullable().default(null),
      instagram: httpsUrl.nullable().default(null),
    })
    .default({}),
  leaders: z.array(teamMember).default([]),
  /** Slug in content/user-groups/. Cross-checked at build time by the pages. */
  parent_user_group: z.string().nullable().default(null),
  notes: z.string().nullable().default(null),
  needs_verification: z.boolean(),
  last_updated: z.coerce.date(),
});

export type UserGroup = z.infer<typeof userGroup>;
export type Event = z.infer<typeof event>;
export type StudentBuilderGroup = z.infer<typeof studentBuilderGroup>;

/**
 * Files beginning with `_` are templates and anything non-YAML is documentation;
 * neither is a record. content/student-builder-groups/ currently holds only
 * those two, which is why that collection legitimately renders empty.
 */
function isRecord(name: string): boolean {
  return /\.ya?ml$/.test(name) && !name.startsWith('_');
}

function yamlDirectoryLoader(directory: string) {
  return {
    name: 'yaml-directory-loader',
    load: async ({ store, parseData, generateDigest, logger }: any) => {
      const base = path.resolve(process.cwd(), directory);
      const files = (await readdir(base)).filter(isRecord).sort();

      store.clear();

      for (const file of files) {
        const absolutePath = path.join(base, file);
        // Astro's data store requires a path relative to the site root.
        const filePath = path.relative(process.cwd(), absolutePath);
        const id = file.replace(/\.ya?ml$/, '');

        // Round-trip through JSON so YAML timestamps arrive as ISO strings and
        // the stored entry is plain, serialisable data.
        const raw = JSON.parse(
          JSON.stringify(parseYaml(await readFile(absolutePath, 'utf8')) ?? {}),
        );

        if (raw.slug !== undefined && raw.slug !== id) {
          throw new Error(
            `${directory}/${file}: slug "${raw.slug}" does not match the filename "${id}"`,
          );
        }

        const data = await parseData({ id, data: raw, filePath });
        store.set({ id, data, digest: generateDigest(data), filePath });
      }

      logger.info(`loaded ${files.length} record(s) from ${directory}`);
    },
  };
}

export const collections = {
  'user-groups': defineCollection({
    loader: yamlDirectoryLoader('content/user-groups'),
    schema: userGroup,
  }),
  events: defineCollection({
    loader: yamlDirectoryLoader('content/events'),
    schema: event,
  }),
  'student-builder-groups': defineCollection({
    loader: yamlDirectoryLoader('content/student-builder-groups'),
    schema: studentBuilderGroup,
  }),
};
