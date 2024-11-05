"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import type { CryptoData } from "@/lib/types";

interface FeaturedCardProps {
  crypto: CryptoData;
}

export function FeaturedCard({ crypto }: FeaturedCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">{crypto.name}</h2>
        <span className="text-sm text-muted-foreground uppercase">
          {crypto.symbol}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-3xl font-bold">{formatPrice(crypto.current_price)}</p>
          <div className="flex items-center gap-2 mt-2">
            {crypto.price_change_percentage_24h > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                crypto.price_change_percentage_24h > 0
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={crypto.sparkline_in_7d.price.map((price, index) => ({
                time: index,
                price,
              }))}
            >
              <Line
                type="monotone"
                dataKey="price"
                stroke={crypto.price_change_percentage_24h > 0 ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatMarketCap(crypto.market_cap)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Volume (24h)</p>
            <p className="font-medium">{formatMarketCap(crypto.total_volume)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}