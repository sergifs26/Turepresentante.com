"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Tu representante deportivo, <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                siempre a tu lado
              </span>
            </h1>
          </>
        }
      >
        <Image
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80"
          alt="Estadio de fútbol profesional"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-center"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
