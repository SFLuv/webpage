import Link from "next/link";

export default function NotFound() {
  return (
    <main className="site-main site-main--page">
      <section className="not-found">
        <h1>Page not found</h1>
        <p>The page you are looking for is not part of the exported SFLuv frontend.</p>
        <Link className="not-found__button" href="/">
          Return home
        </Link>
      </section>
    </main>
  );
}
