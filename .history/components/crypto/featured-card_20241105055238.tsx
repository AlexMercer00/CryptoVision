"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import type { CryptoData } from "@/lib/types";

interface FeaturedCardProps {
  crypto: CryptoData;
  timeRange?: string;
}

export function FeaturedCard({ crypto, timeRange = '24h' }: FeaturedCardProps) {
  const priceChangeKey = `price_change_percentage_${timeRange}`;
  const priceChange = crypto[priceChangeKey] || crypto.price_change_percentage_24h;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-card to-card/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={crypto.image} 
            alt={crypto.name} 
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-semibold">{crypto.name}</h2>
            <span className="text-sm text-muted-foreground uppercase">
              {crypto.symbol}
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Rank #{crypto.market_cap_rank}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-3xl font-bold">{formatPrice(crypto.current_price)}</p>
          <div className="flex items-center gap-2 mt-2">
            {priceChange > 0 ? (
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                priceChange > 0
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {Math.abs(priceChange).toFixed(2)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {timeRange} change
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
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Line
                type="monotone"
                dataKey="price"
                stroke={priceChange > 0 ? "#22c55e" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border p-2 rounded-lg shadow-lg">
                        <p className="text-sm font-medium">
                          {formatPrice(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
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
          <div>
            <p className="text-sm text-muted-foreground">24h High</p>
            <p className="font-medium">{formatPrice(crypto.high_24h)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">24h Low</p>
            <p className="font-medium">{formatPrice(crypto.low_24h)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}