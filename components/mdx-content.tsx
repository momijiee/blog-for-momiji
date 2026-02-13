import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";

const components = {
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-1 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-muted pl-4 italic my-4 text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }: any) => (
    <pre className="bg-muted p-4 rounded-lg mb-4 overflow-x-auto text-sm" {...props}>
      {children}
    </pre>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-7 list-disc ml-6">
      {children}
    </li>
  ),
};

export default function MdxContent({ source }: { source: string }) {
  return <MDXRemote 
    source={source} 
    components={components}
    options={{
      mdxOptions: {
        rehypePlugins:[rehypeSlug]
      }
    }}
    />;
}

