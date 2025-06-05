"use client";
import * as React from "react";

import { IconSvgProps } from "@/types";
import { useTheme } from "next-themes";
import Image from "next/image";
import imageUrl from "../../../public/nft-logo.png";

export const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { width = 25, height = 24 } = props;

  return (
    <svg fill="none" height={height} viewBox="0 0 25 24" width={width} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        clipRule="evenodd"
        d="M11.3086 3.75C7.37356 3.75 4.18359 6.93997 4.18359 10.875C4.18359 14.81 7.37356 18 11.3086 18C15.2436 18 18.4336 14.81 18.4336 10.875C18.4336 6.93997 15.2436 3.75 11.3086 3.75ZM2.68359 10.875C2.68359 6.11154 6.54514 2.25 11.3086 2.25C16.0721 2.25 19.9336 6.11154 19.9336 10.875C19.9336 15.6385 16.0721 19.5 11.3086 19.5C6.54514 19.5 2.68359 15.6385 2.68359 10.875Z"
        fill="#1E1E1E"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M16.3466 15.913C16.6395 15.6201 17.1144 15.6201 17.4073 15.913L21.9635 20.4693C22.2564 20.7622 22.2564 21.237 21.9635 21.5299C21.6706 21.8228 21.1958 21.8228 20.9029 21.5299L16.3466 16.9737C16.0537 16.6808 16.0537 16.2059 16.3466 15.913Z"
        fill="#1E1E1E"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const MoonFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
      fill="currentColor"
    />
  </svg>
);

export const SunFilledIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <g fill="currentColor">
      <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z" />
      <path d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z" />
    </g>
  </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  const { width, height = 20 } = props;

  return (
    <svg fill="none" height={height} viewBox="0 0 20 20" width={width} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        clipRule="evenodd"
        d="M10 3.125C7.58375 3.125 5.625 5.08375 5.625 7.5C5.625 9.91625 7.58375 11.875 10 11.875C12.4162 11.875 14.375 9.91625 14.375 7.5C14.375 5.08375 12.4162 3.125 10 3.125ZM4.375 7.5C4.375 4.3934 6.8934 1.875 10 1.875C13.1066 1.875 15.625 4.3934 15.625 7.5C15.625 10.6066 13.1066 13.125 10 13.125C6.8934 13.125 4.375 10.6066 4.375 7.5Z"
        fill="white"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M10.0001 13.124C8.57374 13.124 7.17251 13.4995 5.93728 14.2128C4.70205 14.926 3.67634 15.9518 2.96327 17.1872C2.79071 17.4861 2.40848 17.5886 2.10953 17.416C1.81058 17.2435 1.70812 16.8612 1.88068 16.5623C2.70345 15.1369 3.88696 13.9532 5.31223 13.1303C6.7375 12.3073 8.3543 11.874 10.0001 11.874C11.6459 11.874 13.2627 12.3073 14.688 13.1303C16.1132 13.9532 17.2968 15.1369 18.1195 16.5623C18.2921 16.8612 18.1896 17.2435 17.8907 17.416C17.5917 17.5886 17.2095 17.4861 17.0369 17.1872C16.3239 15.9518 15.2982 14.926 14.0629 14.2128C12.8277 13.4995 11.4265 13.124 10.0001 13.124Z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  );
};

export const DeleteIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props: IconSvgProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

interface LogoProps {
  width?: number;
  height?: number;
  alt?: string;
  className?: string; // Allow for custom classes
}

export const NftLogo: React.FC<LogoProps> = ({ width = 100, height = 100, alt = "Logo", className = "", ...props }) => {
  const { theme } = useTheme(); // Get the current theme (dark/light) if needed

  return (
    <div
      {...props}
      className={`w-${width} max-w-${width} sm:w-${width} sm:max-w-${width} lg:w-${height} lg:max-w-${height} ${className}`}
    >
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        style={{
          filter: theme === "dark" ? "invert(1)" : "none",
        }}
      />
    </div>
  );
};

export const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export const FilterIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fill = isDark ? "#fff" : "#1E1E1E";

  return (
    <svg
      fill="none"
      height={size || height}
      viewBox="0 0 23 22"
      width={size || width}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M3.25 14.4375C3.25 14.0578 3.5578 13.75 3.9375 13.75H19.0625C19.4422 13.75 19.75 14.0578 19.75 14.4375C19.75 14.8172 19.4422 15.125 19.0625 15.125H3.9375C3.5578 15.125 3.25 14.8172 3.25 14.4375Z"
        fill={fill}
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M3.25 7.5625C3.25 7.1828 3.5578 6.875 3.9375 6.875H19.0625C19.4422 6.875 19.75 7.1828 19.75 7.5625C19.75 7.9422 19.4422 8.25 19.0625 8.25H3.9375C3.5578 8.25 3.25 7.9422 3.25 7.5625Z"
        fill={fill}
        fillRule="evenodd"
      />
      <circle cx="8.0625" cy="7.5625" fill={fill} r="2.0625" />
      <circle cx="14.9375" cy="14.4375" fill={fill} r="2.0625" />
    </svg>
  );
};
