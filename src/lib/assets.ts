/**
 * Turn a repository-relative asset path from the content layer into a URL.
 *
 * Assets stay exactly where they are today (nothing is moved), so a value like
 * `karachi/images/team/ghous.jpeg` becomes `/karachi/images/team/ghous.jpeg`.
 *
 * Several real filenames contain spaces or parentheses -- for example
 * `islamabad/images/team/Alina Shoaib.jpg` -- which must be percent-encoded or
 * the browser request fails. Each path segment is encoded separately so the
 * slashes survive.
 */
export function assetUrl(assetPath: string | null | undefined): string | null {
  if (!assetPath) return null;
  const normalised = assetPath.replace(/^\/+/, '');
  return '/' + normalised.split('/').map(encodeURIComponent).join('/');
}
