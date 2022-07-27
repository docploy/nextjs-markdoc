import Link from 'next/link';
import { format } from 'date-fns';
import fs from 'fs';
import glob from 'glob-promise';
import matter from 'gray-matter';
import path from 'path';

export const getStaticProps = async () => {
  // Find all Markdown files in the /posts directory
  const POSTS_DIR = path.join(process.cwd(), 'posts');
  const postPaths = await glob(path.join(POSTS_DIR, '**/*.md'));
  const posts = postPaths.map((postPath) => {
    const slug = path.basename(postPath, path.extname(postPath));
    const source = fs.readFileSync(postPath, 'utf-8');

    // Use gray-matter to fetch the data between the `---` at the top of our Markdown files.
    const matterResult = matter(source);
    const { title, date } = matterResult.data;

    return {
      title,
      date,
      slug,
    };
  });

  // Sort the posts by date
  const sortedPosts = posts.sort((a, b) => b.date - a.date);

  // We need to format the dates into strings because Next.js expects the props to be serializable as JSON.
  const parsedDatePosts = sortedPosts.map((post) => {
    return {
      ...post,
      date: format(post.date, 'MM/dd/yyyy'),
    };
  });
  return { props: { posts: parsedDatePosts } };
};

const Blog = (props) => {
  const { posts } = props;
  return (
    <div>
      {posts.map((post, i) => {
        return (
          <div key={i}>
            <Link href={'/blog/' + post.slug}>
              <a>
                <h1>{post.title}</h1>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Blog;
