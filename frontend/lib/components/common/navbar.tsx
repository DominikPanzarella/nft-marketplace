"use client";
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import NextLink from "next/link";
import { link as linkStyles } from "@heroui/theme";
import { ThemeSwitch } from "./theme-switch";
import { siteConfig } from "@/config/site";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import SigninButton from "./signin-button";
import { NftLogo } from "./icons";
import { useState } from "react";
import LoginAvatarInfo from "@/lib/components/user/login-avatar-Info";
import { useAuth } from "@/components/AuthProvider";

const NavbarWrapper = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      height="126px"
      maxWidth="2xl"
      position="sticky"
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* LOGO */}
      <NavbarContent className="flex-none">
        <NavbarBrand as="li">
          <NextLink href="/">
            {/* TODO: MISSING LOGO */}
            <NftLogo className="w-32 max-w-32 sm:w-32 sm:max-w-32 lg:w-40 lg:max-w-40" />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Navbar items and Signup button */}
      <NavbarContent className="hidden lg:flex lg:basis-full" justify="end">
        <ThemeSwitch />
        <div className="mr-5 flex items-center gap-8">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href} isActive={item.href === pathname}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground", class: "font-articulatDemiBold" }),
                  pathname === item.href ? "font-articulatDemiBold text-gradient" : "text-foreground",
                  "transition-colors hover:text-gradient"
                )}
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
        {isAuthenticated ? <LoginAvatarInfo /> : <SigninButton isLoading={false} />}
      </NavbarContent>

      {/* theme switch and menu toggle mobile */}
      <NavbarContent className="grow-0 lg:hidden" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={index === 2 ? "primary" : index === siteConfig.navMenuItems.length ? "danger" : "foreground"}
                href={item.href}
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};

export default NavbarWrapper;
