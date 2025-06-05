"use client";

import React from "react";
import { tv } from "tailwind-variants";
import { SectionContainer } from "./section-container";

const heroSecondary = tv({
  slots: {
    base: "flex flex-col gap-8 py-8 md:py-10 lg:py-16",
    title:
      "text-[28px] sm:text-[38px] lg:text-[51px] leading-[38px] sm:leading-[45px] lg:leading-[51px] font-articulatDemiBold mb-2 sm:mb-4",
    subtitle:
      "text-[16px] sm:text-[20px] lg:text-[25px] leading-[22px] sm:leading-[22px] lg:leading-[35px] font-articulatRegular",
    searchInput: "w-full",
  },
});

export const HeroSecondary = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) => {
  const { base, title: titleStyle, subtitle: subtitleStyle, searchInput } = heroSecondary();

  return (
    <SectionContainer>
      <div className="px-6 py-2 lg:py-4 xl:px-0">
        <div className={base()}>
          <div>
            <h1 className={titleStyle()}>{title}</h1>
            <h2 className={subtitleStyle()}>{subtitle}</h2>
          </div>
          {children && <div className={searchInput()}>{children}</div>}
        </div>
      </div>
    </SectionContainer>
  );
};
