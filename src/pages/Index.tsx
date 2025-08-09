import { Link } from "react-router-dom";

const Index = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <article className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground">Start building your amazing project here!</p>
        <div className="mt-6">
          <Link
            to="/hello"
            className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 transition-colors"
            aria-label="Go to Hello World page"
          >
            Go to Hello World
          </Link>
        </div>
      </article>
    </main>
  );
};

export default Index;
