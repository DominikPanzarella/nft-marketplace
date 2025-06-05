"use client";

import React from "react";
import { LogOutIcon, StoreIcon, WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { truncateMiddle } from "@/lib/utils";

const LoginAvatarInfo = () => {
  const router = useRouter();
  const { logout, signer } = useAuth();

  const { data: address = "" } = useQuery({
    queryKey: ["user", "address"],
    queryFn: async () => {
      const address = await signer.getAddress();
      return address;
    },

    enabled: !!signer,
    refetchOnWindowFocus: false,
  });

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <div>
          <Avatar as="button" className="h-14 w-14 transition-transform" name={""} src={""} />
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" disabledKeys={["favorites"]} variant="flat">
        <>
          <DropdownItem
            key="profile"
            className="gap-2 bg-secondary text-secondary-foreground dark:bg-default-100 dark:text-default-900"
          >
            <div className="mb-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{truncateMiddle(address)}</p>
            </div>
          </DropdownItem>

          {[
            { key: "dashboard", icon: StoreIcon, label: "user details" },

            {
              key: "portafolio",
              icon: WalletIcon,
              label: "Portfolio",
            },
          ].map((item) => (
            <DropdownItem key={item.key} onPress={() => router.push(`/users/me`)}>
              <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span className="font-archivo">{item.label}</span>
              </div>
            </DropdownItem>
          ))}
          <DropdownItem
            key="logout"
            color="danger"
            onPress={async () => {
              await logout();
            }}
          >
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
              <LogOutIcon className="h-4 w-4" />
              <span className="font-archivo">Log Out</span>
            </div>
          </DropdownItem>
        </>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LoginAvatarInfo;
