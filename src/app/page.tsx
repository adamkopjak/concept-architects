import Approach from "@/components/Approach";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Manifesto from "@/components/Manifesto";
import Nav from "@/components/Nav";
import Numbers from "@/components/Numbers";
import ProjectSection from "@/components/ProjectSection";
import SiteEffects from "@/components/SiteEffects";
import Studio from "@/components/Studio";
import Ticker from "@/components/Ticker";
import WorksList from "@/components/WorksList";
import { getProjects } from "@/lib/projects";

export default function Home() {
  const projects = getProjects();

  return (
    <>
      <Loader />
      <Cursor />
      <Nav />
      <main id="top">
        <Hero />
        <Ticker />
        <Manifesto />
        <WorksList projects={projects} />
        {projects.map((p, i) => (
          <ProjectSection key={p.slug} project={p} index={i + 1} total={projects.length} />
        ))}
        <Studio />
        <Numbers />
        <Approach />
        <Contact />
        <Footer />
      </main>
      <SiteEffects />
    </>
  );
}
