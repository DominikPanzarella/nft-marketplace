import React from "react";
import { Badge, Card, Image } from "@heroui/react";
import { Icon } from "@iconify/react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-purple-500 opacity-20 blur-[120px] filter"></div>
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-blue-500 opacity-20 blur-[120px] filter"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYyYzguODQgMCAxNiA3LjE2IDE2IDE2aC0yYzAtNy43Mi02LjI4LTE0LTE0LTE0djJjNi42MyAwIDEyIDUuMzcgMTIgMTJoMnptLTEuOTggMTRjLTcuMSAwLTEyLjk4LTUuNzYtMTMtMTIuODVDMjAuOTggMTIuMjQgMjYuODcgNi40IDM0IDYuNGM3LjA4IDAgMTIuOTQgNS43NiAxMyAxMi44M2EuOTYuOTYgMCAwIDEtLjI3LjcxLjk3Ljk3IDAgMCAxLS43LjMxSDM0LjAyYy0uNTQgMC0uOTgtLjQ0LS45OC0uOTggMC0uNTUuNDQtLjk5Ljk4LS45OWgxMC45OWMtLjEtNS44MS01LjA2LTEwLjU3LTExLTEwLjU3LTYuMDggMC0xMS4xMyA0Ljk0LTExIDExLjAzLjEgNS45NCA1LjA2IDEwLjc2IDExIDEwLjc2LjU1IDAgLjk5LjQ0Ljk5Ljk5IDAgLjU0LS40NC45OC0uOTkuOTh6IiBmaWxsPSIjZmZmZmZmIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>

      <div className="container relative z-10 mx-auto px-6 py-16">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Left side - Text content */}
          <div className="flex-1 text-center lg:text-left">
            <Badge color="primary" variant="flat" className="mb-4">
              DISCOVER • COLLECT • SELL
            </Badge>

            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">NFT</span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>

            <p className="mx-auto mb-8 mt-6 max-w-2xl text-lg text-gray-300 md:text-xl lg:mx-0">
              Discover, collect, and sell extraordinary NFTs. Explore the world&#39;s best digital art marketplace with
              secure blockchain technology.
            </p>
          </div>

          {/* Right side - Featured NFTs */}
          <div className="relative flex-1">
            <div className="relative h-[500px] w-full">
              {/* Main featured NFT */}
              <Card isHoverable className="absolute right-0 top-0 z-20 w-64 overflow-hidden md:w-80" shadow="lg">
                <Image
                  removeWrapper
                  alt="Featured NFT"
                  className="z-0 h-full w-full object-cover"
                  src="https://img.heroui.chat/image/ai?w=400&h=500&u=nft1"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="font-semibold text-white">Cosmic Dreams #342</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-300">Current bid:</span>
                    <span className="text-sm font-bold text-white">2.5 ETH</span>
                  </div>
                </div>
              </Card>

              {/* Secondary NFTs */}
              <Card
                isHoverable
                className="absolute left-0 top-20 z-10 w-56 rotate-[-6deg] overflow-hidden md:w-64"
                shadow="md"
              >
                <Image
                  removeWrapper
                  alt="Secondary NFT"
                  className="z-0 h-full w-full object-cover"
                  src="https://img.heroui.chat/image/ai?w=300&h=400&u=nft2"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-sm font-semibold text-white">Digital Genesis</p>
                </div>
              </Card>

              <Card
                isHoverable
                className="absolute bottom-10 left-20 z-10 w-48 rotate-[8deg] overflow-hidden md:w-56"
                shadow="md"
              >
                <Image
                  removeWrapper
                  alt="Third NFT"
                  className="z-0 h-full w-full object-cover"
                  src="https://img.heroui.chat/image/ai?w=300&h=400&u=nft3"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-sm font-semibold text-white">Neon Horizons</p>
                </div>
              </Card>

              {/* Floating elements */}
              <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-70 blur-md filter"></div>
              <div className="absolute right-1/4 top-1/2 h-12 w-12 animate-pulse rounded-full bg-blue-500 opacity-50 blur-sm filter"></div>
            </div>
          </div>
        </div>

        {/* Trusted by section */}
        <div className="mt-20 text-center">
          <p className="mb-6 text-gray-400">TRUSTED BY TOP CREATORS</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
            <Icon icon="logos:ethereum" width={32} height={32} />
            <Icon icon="logos:polygon" width={32} height={32} />
            <Icon icon="logos:solana" width={120} height={24} />
            <Icon icon="logos:metamask-icon" width={32} height={32} />
            <Icon icon="logos:opensea" width={120} height={28} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
