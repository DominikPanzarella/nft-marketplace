import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/app/nft/collection/deploy/(collection form)/deploy-collection-form";

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard = ({ collection }: CollectionCardProps) => (
  <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-xl">
    <div className="relative h-64 w-full">
      {collection.imageUrl ? (
        <Image
          src={collection.imageUrl}
          alt={collection.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
          <span className="text-white/80">{collection.name.charAt(0)}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h3 className="mb-1 text-xl font-semibold text-white">{collection.name}</h3>
    </div>
    <div className="absolute right-4 top-4">
      <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-white backdrop-blur-sm">
        <span className="font-mono">
          {collection.address.slice(0, 6)}...{collection.address.slice(-4)}
        </span>
      </div>
    </div>
    <Link
      href={`/nft/collection/${collection.address}`}
      className="absolute inset-0"
      aria-label={`View ${collection.name} collection`}
    />
  </div>
);

export default CollectionCard;
