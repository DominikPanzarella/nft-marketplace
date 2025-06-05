"use client";
import { formScheme } from "./form-scheme";
import * as z from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast, Form } from "@heroui/react";
import InputString from "@/lib/components/form/input-string";
import TextArea from "@/lib/components/form/text-area";
import InputSelect from "@/lib/components/form/input-select";
import InputTraits from "@/lib/components/form/input-traits";
import SubmitButton from "@/lib/components/form/submit-button";
import TraitsTable from "@/lib/components/form/traits-table";
import InputImage from "@/lib/components/form/input-image";
import { useRouter } from "next/navigation";
import DeployNewCollectionButton from "@/lib/components/form/deploy-new-collection";
import { useAuth } from "@/components/AuthProvider";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getFormattedCollections } from "@/lib/api/nft";
import { MARKET_ITEM_KEY, NFT_FORM_COLLECTIONS } from "@/lib/url-keys";

export type NftFormType = z.infer<typeof formScheme>;

const NftForm = ({
  values,
  onSubmit,
}: {
  values: Partial<NftFormType>;
  onSubmit: (values: NftFormType) => Promise<any>;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signer } = useAuth();

  const { data: collections = [] } = useQuery({
    queryKey: [NFT_FORM_COLLECTIONS],
    queryFn: () => getFormattedCollections(signer),
    enabled: !!signer,
    refetchInterval: 5000,
    staleTime: 0,
  });

  const { getValues, handleSubmit, setValue, control, watch } = useForm<NftFormType>({
    resolver: zodResolver(formScheme),
    defaultValues: values,
  });

  const handleSubmitFn: SubmitHandler<NftFormType> = async (data) => {
    onSubmit(data)
      .then(async (result) => {
        data.tokenId = result.tokenId;
        // Invalidate and force refetch market items query
        await queryClient.invalidateQueries({
          queryKey: ["marketItems", NFT_FORM_COLLECTIONS, "collections"],
          refetchType: "active",
        });
        await queryClient.invalidateQueries({
          queryKey: ["collections", "FormattedCollections"],
          refetchType: "active",
        });
        // Force an immediate refetch
        await queryClient.refetchQueries({
          queryKey: ["marketItems", "collections"],
          type: "active",
        });
        // Also invalidate the collections query to ensure fresh data
        await queryClient.invalidateQueries({
          queryKey: ["FormattedCollections"],
          refetchType: "active",
        });
        await queryClient.invalidateQueries({
          queryKey: ["marketItems"],
          refetchType: "active",
        });
        addToast({
          title: "Nft Minted",
          description: "NFT Minted successfully",
          color: "success",
        });
        // Simple string URL for navigation
        router.push(`/nft/${result.nftContractAddress}/${result.tokenId}`);
      })
      .catch((err) => {
        addToast({
          title: "Error",
          description: err,
          color: "danger",
        });
        console.log(err);
      });
  };

  const handleDelete = (index: number) => {
    const currentTraits = getValues("traits") || [];
    const updatedTraits = currentTraits.filter((_, i) => i !== index);
    setValue("traits", updatedTraits, { shouldValidate: true });
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (
    <Form onSubmit={handleSubmit(handleSubmitFn)}>
      <div className="flex w-full gap-8">
        <div className="flex min-h-[300px] w-1/2 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          {/*fixme type*/}
          {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
          {/*@ts-ignore*/}
          <InputImage control={control} name="image" onRemove={() => setValue("image", null)} />
        </div>
        <div className="flex w-1/2 flex-col gap-4">
          <div className="flex items-center gap-4">
            {collections.length > 0 && (
              <InputSelect
                control={control}
                name="collection"
                label="Collection"
                options={collections}
                placeholder="Select a collection"
                required
              />
            )}
            <DeployNewCollectionButton onClick={() => router.push("/nft/collection/deploy")} />
          </div>
          <InputString control={control} name="name" label="Name" />
          <TextArea control={control} name="description" label="Description" />
          <TraitsTable
            traits={watch("traits") || []}
            onEdit={(index) => console.log("Edit trait at:", index)}
            onDelete={(index) => handleDelete(index)}
          />
          <InputTraits control={control} name="traits" label="NFT Traits" />
          <SubmitButton />
        </div>
      </div>
    </Form>
  );
};

export default NftForm;
