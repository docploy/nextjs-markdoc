import glob from 'glob-promise';
import path from 'path';

export const getStaticPaths = async () => {
  // Our Markdown files are stored in the posts/ directory
  const POSTS_DIR = path.join(process.cwd(), 'posts');

  // Find all Markdown files in the posts/ directory
  // With The glob-promise library, we can use a one liner to find our Markdown files
  const postPaths = await glob(path.join(POSTS_DIR, '**/*.md'));

  // For each filename, the slug is the filename without the .md extension
  const paths = postPaths.map((postPath) => {
    const slug = path.basename(postPath, path.extname(postPath));
    return { params: { slug } };
  });

  // Return the possible paths
  return { paths, fallback: false };
};
