import ProjectsCarousel from "@/components/ProjectsCarousel";
import { Project, Setting } from "@/types/database";
import supabase from "@/utils/supabaseConfig";
import { ArrowDown02Icon } from "hugeicons-react";
import { Metadata } from "next";
import Image from "next/image";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Cheik Cissé",
  description: "Designer et Développeur web/mobile fullstack",
  icons: [
    {
      url: "https://bzszwpattbiphmxezsij.supabase.co/storage/v1/object/sign/CC%20Portfolio/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDQyBQb3J0Zm9saW8vbG9nby5wbmciLCJpYXQiOjE3Mjc2ODk3NjYsImV4cCI6NDg4MTI4OTc2Nn0.OD-B5aGMelJo4zhj4q3oB2IGgEmL61JNfj5In_TjQm0&t=2024-09-30T09%3A49%3A26.310Z",
    },
  ],
  openGraph: {
    title: "Cheik Cissé",
    description: "Designer et Développeur web/mobile fullstack",
    type: "website",
    url: "https://cheikcisse.com",
    images: [
      {
        url: "https://bzszwpattbiphmxezsij.supabase.co/storage/v1/object/sign/CC%20Portfolio/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDQyBQb3J0Zm9saW8vbG9nby5wbmciLCJpYXQiOjE3Mjc2ODk3NjYsImV4cCI6NDg4MTI4OTc2Nn0.OD-B5aGMelJo4zhj4q3oB2IGgEmL61JNfj5In_TjQm0&t=2024-09-30T09%3A49%3A26.310Z",
        width: 1200,
        height: 630,
        alt: "Cheik Cissé",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "Cheik Cissé",
    description: "Designer et Développeur web/mobile fullstack",
    title: "Cheik Cissé",
    images: [
      {
        url: "https://bzszwpattbiphmxezsij.supabase.co/storage/v1/object/sign/CC%20Portfolio/logo.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJDQyBQb3J0Zm9saW8vbG9nby5wbmciLCJpYXQiOjE3Mjc2ODk3NjYsImV4cCI6NDg4MTI4OTc2Nn0.OD-B5aGMelJo4zhj4q3oB2IGgEmL61JNfj5In_TjQm0&t=2024-09-30T09%3A49%3A26.310Z",
        width: 1200,
        height: 630,
        alt: "Cheik Cissé",
      },
    ],
  },
};

async function getData(): Promise<{
  projects: Project[];
  settings: Setting | null;
}> {
  const data: {
    projects: Project[];
    settings: Setting | null;
  } = {
    projects: [],
    settings: null,
  };

  const { data: projects, error } = await supabase.from("projects").select("*");
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  data.projects = projects as Project[];
  data.settings = settings as Setting;

  return data;
}

export default async function Home() {
  const { projects, settings } = await getData();

  return (
    <main className="">
      <section id="hero" className="cc-container py-28">
        <h1 className="text-[35px] small:text-[60px]] sm:text-[80px] leading-normal sm:leading-[110px] max-w-full mb-16">
          Designer et développeur de produits numériques performants et élégants
        </h1>
        <div className="pt-16 border-t border-[#5D4300] flex justify-between items-end flex-wrap gap-y-8">
          <div className="flex items-center gap-2">
            <Image
              src={settings?.avatar || ""}
              alt="Cheik Cissé"
              width={55}
              height={55}
              className="rounded-full object-cover w-[55px] h-[55px]"
            />
            <p className="max-w-[546px] text-[#5D4300]">
              Je suis Cheik CISSE, développeur et designer polyvalent de site
              web, application mobile, logiciel Desktop.
            </p>
          </div>
          <a href="#contact" className="cc-button">
            <span>Contactez-moi</span>
            <ArrowDown02Icon size={18} />
          </a>
        </div>
      </section>
      <section id="projects" className="cc-container mb-28">
        <ProjectsCarousel projects={projects} />
      </section>
      <section id="about" className="bg-black">
        <div className="cc-container py-28 flex flex-col justify-center items-center gap-28">
          <Image
            src={settings?.avatar || ""}
            alt="Cheik Cissé"
            width={234}
            height={234}
            className="rounded-full bg-white object-cover w-[234px] h-[234px]"
          />
          <p className="text-white text-[25px] sm:text-[40px] max-w-full text-center normal-case leading-[55px]">
            Je m’appelle Cheik CISSÉ.
            <br />
            <br />
            Je suis un développeur Fullstack et un passionné du Design. Je suis
            basé au Burkina Faso et je travaille avec des équipes et des
            particuliers du monde entier sur diverses projets (web, mobile)
            depuis 6 belles années déjà.
            <br />
            <br />
            J’aime les belles interfaces et je m’impose de les rendre
            performantes, accessibles et adaptées au besoin de mes partenaires
            et des utilisateurs.
          </p>
        </div>
      </section>
    </main>
  );
}
