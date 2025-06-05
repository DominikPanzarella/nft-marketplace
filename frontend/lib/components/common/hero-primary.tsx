"use client";
import React from "react";
import { tv } from "tailwind-variants";
import { titlePrimitives } from "../common/primitives";
import { SectionContainer } from "./section-container";

const heroPrimary = tv({
  slots: {
    base: "flex flex-col gap-8 py-8 md:py-10 lg:py-16",
    title: titlePrimitives({
      color: "blue-gradient",
      fullWidth: true,
      size: "lg",
    }),
  },
});

const HeroPrimary = ({ title, children }: { title: String; children?: React.ReactNode }) => {
  const { base, title: titleStyle } = heroPrimary();

  return (
    <SectionContainer>
      <div className="px-6 py-2 lg:py-4 xl:px-0">
        <div className={base()}>
          <div>
            <h1 className={titleStyle()}>{title}</h1>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default HeroPrimary;
