"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { web3auth, isAuthenticated, handleLogin, handleLogout } from "@/lib/web3auth/web3auth";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

// Aggiungi questa interfaccia per il contesto
interface AuthContextType {
  isAuthenticated: boolean;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  fundAccount: (address: string) => Promise<void>; // Nuova funzione
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  provider: null,
  signer: {} as ethers.Signer,
  login: async () => {},
  logout: async () => {},
  fundAccount: async () => {}, // Inizializzazione
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer>({} as ethers.Signer);

  // Funzione per fondare l'account
  const fundAccount = async (address: string) => {
    if (!window.ethereum) {
      console.error("Ethereum provider not found");
      return;
    }

    try {
      const hardhatProvider = new ethers.JsonRpcProvider("http://localhost:8545");
      // Prendi l'account con fondi (il primo account di Hardhat)
      const fundedSigner = await hardhatProvider.getSigner(0);

      // Invia 10 ETH all'account
      const tx = await fundedSigner.sendTransaction({
        to: address,
        value: ethers.parseEther("1000"),
      });
      await tx.wait();
      console.log(`Funded ${address} with 1000 ETH`);
      // Verifica il nuovo saldo
      const newBalance = await hardhatProvider.getBalance(address);
      console.log(`New balance: ${ethers.formatEther(newBalance)} ETH`);
    } catch (error) {
      console.error("Error funding account:", error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedAuth = localStorage.getItem("connected") === "true";
        if (isAuthenticated() || savedAuth) {
          await web3auth.initModal();
          if (web3auth.provider) {
            const newProvider = new ethers.BrowserProvider(web3auth.provider);
            const newSigner = await newProvider.getSigner();

            // Fondi l'account al login
            const address = await newSigner.getAddress();
            await fundAccount(address);

            setProvider(newProvider);
            setSigner(newSigner);
            setIsAuth(true);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuth(false);
      }
    };

    initAuth();

    const handleAuthStateChange = () => {
      setIsAuth(isAuthenticated());
    };

    web3auth.on("connected", handleAuthStateChange);
    web3auth.on("disconnected", handleAuthStateChange);

    return () => {
      web3auth.off("connected", handleAuthStateChange);
      web3auth.off("disconnected", handleAuthStateChange);
    };
  }, []);

  const login = async () => {
    try {
      if (web3auth.connected) return;
      const web3authProvider = await handleLogin();
      if (web3authProvider) {
        const newProvider = new ethers.BrowserProvider(web3authProvider);
        const newSigner = await newProvider.getSigner();

        // Fondi l'account al login
        const address = await newSigner.getAddress();
        await fundAccount(address);

        setProvider(newProvider);
        setSigner(newSigner);
        setIsAuth(true);

        localStorage.setItem("connected", "true");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsAuth(false);
      localStorage.removeItem("connected");
    }
  };

  const logout = async () => {
    try {
      await handleLogout();
      setProvider(null);
      setIsAuth(false);
      localStorage.removeItem("connected");
    } catch (error) {
      console.error("Logout error:", error);
      setIsAuth(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuth,
        provider,
        signer,
        login,
        logout,
        fundAccount, // Esponi la funzione
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
