import React from "react";
import { Link, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <footer className="bg-black bg-opacity-60 pb-6 pt-12 text-white backdrop-blur-sm">
      <div className="container mx-auto px-6">
        {/* Footer content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 - About */}
          <div>
            <h3 className="mb-4 text-xl font-bold">NFT Marketplace</h3>
            <p className="mb-4 text-gray-400">
              The world&#39;s first and largest digital marketplace for crypto collectibles and non-fungible tokens.
            </p>
            <div className="flex space-x-4">
              <Link href="#" isExternal aria-label="Twitter">
                <Icon
                  icon="lucide:twitter"
                  className="text-gray-400 transition-colors hover:text-white"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="#" isExternal aria-label="Instagram">
                <Icon
                  icon="lucide:instagram"
                  className="text-gray-400 transition-colors hover:text-white"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="#" isExternal aria-label="Discord">
                <Icon
                  icon="lucide:message-circle"
                  className="text-gray-400 transition-colors hover:text-white"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="#" isExternal aria-label="Youtube">
                <Icon
                  icon="lucide:youtube"
                  className="text-gray-400 transition-colors hover:text-white"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          </div>

          {/* Column 2 - Marketplace */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  All NFTs
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Art
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Collectibles
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Virtual Worlds
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Music
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="#" color="foreground" className="text-gray-400 hover:text-white">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Subscribe */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-4 text-gray-400">
              Join our mailing list to stay in the loop with our newest feature releases, NFT drops, and tips.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full rounded-l-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
              />
              <button className="rounded-r-md bg-blue-600 px-4 py-2 transition-colors hover:bg-blue-700">
                <Icon icon="lucide:send" width={18} height={18} />
              </button>
            </div>
          </div>
        </div>

        <Divider className="my-6 bg-gray-800" />

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} NFT Marketplace. All rights reserved.</p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="#" color="foreground" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" color="foreground" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
