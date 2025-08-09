import { useEffect } from "react";
import { Link } from "react-router-dom";

const Hello = () => {
  useEffect(() => {
    document.title = "Hello World | Blank App";

    const ensureMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    ensureMeta("description", "Hello World page demonstrating routing and SEO.");

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/hello`);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4">
          <Link to="/" className="text-sm text-muted-foreground hover:underline" aria-label="Back to Home">
            ← Back to Home
          </Link>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-16">
        <article className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Hello World</h1>
          <p className="text-lg text-muted-foreground">
            This is a simple Hello World page using our design system and semantic HTML.
          </p>
        </article>
      </main>
    </div>
  );
};

export default Hello;
