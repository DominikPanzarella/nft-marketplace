"use server";

import { redirect } from "next/navigation";

export const searchAction = async (formData: FormData) => {
  const searchTerm = formData.get("searchTerm");

  if (searchTerm) {
    redirect(`/marketplace?searchTerm=${searchTerm}`);
  } else {
    redirect("/marketplace");
  }
};
