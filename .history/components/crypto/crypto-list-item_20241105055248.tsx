"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import type { CryptoData } from "@/lib/types";

interface CryptoListItemProps {
  crypto: CryptoData;
  timeRange?: string;
}

export function CryptoListItem({ crypto, timeRange = '24h' }: CryptoListItemProps) {
  const priceChangeKey = `price_change_percentage_${timeRange}`;
  const priceChange = crypto[priceChangeKey] || crypto.price_change_percentage_24h;

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={crypto.image} 
            alt={crypto.name} 
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className="font-semibold">{crypto.name}</h3>
            <p className="text-sm text-muted-foreground uppercase">
              {crypto.symbol}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-semibold">{formatPrice(crypto.current_price)}</p>
            <div className="flex items-center justify-end gap-1">
              {priceChange > 0 ? (
                <ArrowUpIcon className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm",
                  priceChange > 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {Math.abs(priceChange).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="w-32 h-16">
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
                  stroke={priceChange > 0 ? "#22c55e" : "#ef4444"}
                  strokeWidth={1.5}
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
          <div className="hidden md:block text-right">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatMarketCap(crypto.market_cap)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}