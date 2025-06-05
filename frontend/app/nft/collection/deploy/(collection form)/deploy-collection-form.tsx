"use client";
import { addToast, Form } from "@heroui/react";
import { formScheme } from "./form-scheme";
import * as z from "zod";
import InputString from "@/lib/components/form/input-string";
import { SubmitHandler, useForm } from "react-hook-form";
import SubmitButton from "@/lib/components/form/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import InputImage from "@/lib/components/form/input-image";
import { useQueryClient } from "@tanstack/react-query";

export type CollectionFormType = z.infer<typeof formScheme>;

export type Collection = {
  address: string;
  name: string;
  symbol: string;
  baseURI?: string;
  image?: File;
  imageUrl?: string;
};

const CollectionForm = ({
  values,
  onSubmit,
}: {
  values: Partial<CollectionFormType>;
  onSubmit: (values: CollectionFormType) => Promise<any>;
}) => {
  const { handleSubmit, control, resetField } = useForm<CollectionFormType>({
    resolver: zodResolver(formScheme),
    defaultValues: values,
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmitFn: SubmitHandler<z.infer<typeof formScheme>> = async (data) =>
    onSubmit(data)
      .then(() => {
        addToast({
          title: "Collection Deployed",
          description: "Collection deployed successfully",
          color: "success",
        });

        queryClient
          .invalidateQueries({
            queryKey: ["collections", "FormattedCollections"],
            refetchType: "active",
          })
          .then(() => {
            queryClient.refetchQueries({
              queryKey: ["collections", "FormattedCollections"],
              type: "active",
            });
          })
          .then(() => {
            router.back();
          });
      })
      .catch((err) => {
        addToast({
          title: "Error Deploying Collection",
          description: err.message(),
          color: "danger",
        });
      });

  return (
    <Form onSubmit={handleSubmit(handleSubmitFn)}>
      <div className="flex w-full gap-8">
        <div className="flex min-h-[300px] w-1/2 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          <InputImage control={control} name="image" onRemove={() => resetField("image")} />
        </div>
        <div className="flex w-1/2 flex-col gap-4">
          <InputString control={control} name="name" label="Contract Name" />
          <InputString control={control} name="symbol" label="Token Symbol" />
          <SubmitButton />
        </div>
      </div>
    </Form>
  );
};

export default CollectionForm;
