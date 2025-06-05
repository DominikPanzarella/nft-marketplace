"use client";

import React from "react";
import { ethers } from "ethers";
import { Card, CardBody } from "@heroui/card";
import { Avatar, Snippet } from "@heroui/react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";

export const UserInfoCard = ({ username, isLoggedInUser = false }: { username: string; isLoggedInUser?: boolean }) => {
  const { signer, provider } = useAuth();

  const { data } = useQuery({
    queryKey: ["personalInfo"],
    queryFn: async () => {
      if (!provider) throw new Error("error get provider");
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      return {
        address,
        balance,
        network,
      };
    },
    enabled: isLoggedInUser,
  });

  return (
    <div className="px-6 pb-10 pt-10 sm:pb-20 xl:px-0">
      <Card className="shadow-none sm:shadow-2xl">
        <CardBody className="p-0 sm:p-7 lg:p-10">
          <div className="mb-7 flex flex-col lg:flex-row lg:justify-between">
            <div className="mb-7 flex items-center gap-4 sm:gap-7">
              <div className="shrink-0">
                <Avatar
                  className="h-[120px] w-[120px]"
                  classNames={{
                    base: "!bg-opacity-100",
                    icon: "text-black/80",
                    name: "text-2xl",
                  }}
                  name={username}
                  radius="full"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Snippet hideSymbol codeString={data?.address} color="primary" size="lg" variant="solid">
                  <div className="truncate text-xl">{data?.address}</div>
                </Snippet>
              </div>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-8">
            <div className="rounded-xl bg-gray-50 p-4">
              <h5 className="font-panelSansBold text-[22px] lg:text-[28px]">
                {data?.balance ? ethers.formatEther(data.balance) : "0"}
              </h5>
              <p className="font-archivo text-base text-gray-500 lg:text-[22px]">ETH</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
