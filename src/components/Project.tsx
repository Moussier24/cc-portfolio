import Image from "next/image";
import React from "react";
import Tag from "./Tag";
import Link from "next/link";
import { Project as IProjet } from "@/types/database";

type Props = {
  project: IProjet;
};

export default function Project({ project }: Props) {
  if (!project) return null;
  return (
    <Link href={`/projects/${project.uid}`}>
      <article className="flex flex-col">
        <div className="flex-1 p-5 pr-0 pb-0 aspect-[4/3] rounded-[15px] bg-black overflow-hidden">
          <Image
            src={project.thumbnail || ""}
            alt={project.name || ""}
            loading="lazy"
            width={600}
            height={500}
            className="w-full h-full rounded-[10px] rounded-tr-none rounded-bl-none object-cover"
          />
        </div>
        <h3 className="text-[20px] text-left leading-[auto] mt-[20px] mb-[14px]">
          {project.name}
        </h3>
        <div className="flex gap-3">
          {project.roles?.map((role) => (
            <Tag key={role} text={role.toUpperCase()} />
          ))}
        </div>
      </article>
    </Link>
  );
}
