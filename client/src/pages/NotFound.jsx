import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "@/components/ui/Button";

const NotFound = () => (
  <>
    <Helmet>
      <title>Page Not Found | Cravella Cookies</title>
    </Helmet>
    <section className="page-shell flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="section-kicker">404</p>
      <h1 className="mt-3 text-5xl font-semibold">This page wandered out of the oven.</h1>
      <p className="mt-4 max-w-xl text-lg text-brand-brown/75">
        The page you’re looking for doesn’t exist, but the cookies are still very much here.
      </p>
      <Link to="/" className="mt-8">
        <Button>Back to Home</Button>
      </Link>
    </section>
  </>
);

export default NotFound;
