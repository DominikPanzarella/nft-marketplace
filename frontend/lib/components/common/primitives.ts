import { tv } from "tailwind-variants";

export const titlePrimitives = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
      foreground: "dark:from-[#FFFFFF] dark:to-[#4B4B4B]",
      "blue-gradient": "from-[#FF62C0] via-[#9666FF] to-[#5379FF]",
    },
    size: {
      sm: "text-[22px] sm:text-[22px] lg:text-[22px] leading-[30px] font-articulatDemiBold",
      md: "text-[28px] sm:text-[28px] lg:text-[38px] leading-[38px] font-articulatDemiBold",
      lg: "text-[38px] sm:text-[51px] lg:text-[67px] leading-[45px] sm:leading-[56px] lg:leading-[72px] font-articulatDemiBold",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
  },
  compoundVariants: [
    {
      color: ["violet", "yellow", "blue", "cyan", "green", "pink", "foreground", "blue-gradient"],
      class: "bg-clip-text text-transparent bg-gradient-to-b",
    },
  ],
});

export const subtitlePrimitives = tv({
  base: "w-full md:w-1/2 text-lg lg:text-xl block max-w-full font-semibold",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
    size: {
      sm: "text-[16px] md:text-[22px]",
      md: "text-[16px] sm:text-[16px] lg:text-[22px] xl:text-[22px] font-normal leading-normal font-articulat",
      lg: "text-[16px] sm:text-[22px] lg:text-[22px] xl:text-[22px] font-panelSansMedium",
    },
  },
  defaultVariants: {
    fullWidth: true,
    size: "md",
  },
});

export const bodyPrimitives = tv({
  base: "text-base font-archivo",
  variants: {
    size: {
      tiny: "text-[12px]",
      tinyRes: "text-[12px] sm:text-[16px]",
      sm: "text-[14px]",
      md: "text-[16px]",
      lg: "text-[20px] font-panelSansMedium",
      mdWorkSans: "text-[16px] font-workSans font-semibold",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
