import React from "react";

export const SectionContainer = ({
  children,
  contentFullWidth,
}: {
  children: React.ReactNode;
  contentFullWidth?: boolean;
}) => {
  return (
    <section
      className={`container mx-auto flex-grow sm:max-w-3xl lg:max-w-6xl 2xl:max-w-7xl ${contentFullWidth ? "lg:max-w-full 2xl:max-w-full" : ""}`}
    >
      {children}
    </section>
  );
};
