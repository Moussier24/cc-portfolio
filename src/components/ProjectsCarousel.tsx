"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Project from "./Project";
import { ArrowLeft02Icon, ArrowRight02Icon } from "hugeicons-react";
import { Project as IProject } from "@/types/database";

type Props = {
  projects: IProject[];
};

export default function ProjectsCarousel({ projects }: Props) {
  const carouselRef = React.useRef(null);
  return (
    <div>
      <div className="flex justify-between items-end mb-12 flex-wrap gap-y-8">
        <h2 className="text-[48px] leading-snug">
          Quelques
          <br />
          Projets
        </h2>
        <div className="flex items-center gap-2 pb-2">
          <button
            className="cc-button w-12 h-12 rounded-full"
            onClick={() => carouselRef.current?.previous()}
          >
            <span>
              <ArrowLeft02Icon size={24} />
            </span>
          </button>
          <button
            className="cc-button w-12 h-12 rounded-full"
            onClick={() => carouselRef.current?.next()}
          >
            <span>
              <ArrowRight02Icon size={24} />
            </span>
          </button>
        </div>
      </div>

      <Carousel
        ref={carouselRef}
        responsive={{
          desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 2,
            slidesToSlide: 2,
          },
          tablet: {
            breakpoint: { max: 1024, min: 768 },
            items: 2,
            slidesToSlide: 2, // optional, default to 1.
          },
          mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 1,
            slidesToSlide: 1,
          },
        }}
        showDots={false}
        arrows={false}
        draggable={true}
        containerClass="[&>ul]:gap-4 [&>ul]:max-w-full"
      >
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </Carousel>
    </div>
  );
}
