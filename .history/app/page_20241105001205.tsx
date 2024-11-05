"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcw } from "lucide-react";
import { FeaturedCard } from "@/components/crypto/featured-card";
import { CryptoListItem } from "@/components/crypto/crypto-list-item";
import type { CryptoData } from "@/lib/types";

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true"
      );
      const data = await response.json();
      setCryptoData(data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              CryptoVision
            </h1>
            <p className="text-muted-foreground mt-2">
              Real-Time Cryptocurrency Dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cryptoData.slice(0, 3).map((crypto) => (
            <FeaturedCard key={crypto.id} crypto={crypto} />
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">All Cryptocurrencies</TabsTrigger>
            <TabsTrigger value="trending" className="flex-1 sm:flex-none">Trending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {cryptoData.map((crypto) => (
                <CryptoListItem key={crypto.id} crypto={crypto} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="grid gap-4">
              {cryptoData
                .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
                .slice(0, 5)
                .map((crypto) => (
                  <CryptoListItem key={crypto.id} crypto={crypto} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}