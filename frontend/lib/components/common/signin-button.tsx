"use client";

import { Button } from "@heroui/button";
import { UserIcon } from "./icons";
import { useAuth } from "@/components/AuthProvider";

const SigninButton = ({ isLoading }: { isLoading: boolean }) => {
  const { login } = useAuth();

  return (
    <Button
      isLoading={isLoading}
      className="text-base"
      color="primary"
      size="lg"
      startContent={<UserIcon />}
      variant="solid"
      onPress={async () => {
        try {
          await login();
        } catch (error) {
          console.error("Login failed:", error);
        }
      }}
    >
      Sign In with Web3Auth
    </Button>
  );
};

export default SigninButton;
