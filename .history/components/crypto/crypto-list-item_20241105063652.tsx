"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import type { CryptoData } from "@/lib/types";

interface CryptoListItemProps {
  crypto: CryptoData;
  timeRange?: string;
}

export function CryptoListItem({ crypto, timeRange = '24h' }: CryptoListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const priceChangeKey = `price_change_percentage_${timeRange}`;
  const priceChange = crypto[priceChangeKey] || crypto.price_change_percentage_24h;

  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <Im 
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
          {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">24h High</p>
              <p className="font-medium">{formatPrice(crypto.high_24h)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Low</p>
              <p className="font-medium">{formatPrice(crypto.low_24h)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Volume (24h)</p>
              <p className="font-medium">{formatMarketCap(crypto.total_volume)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Circulating Supply</p>
              <p className="font-medium">{crypto.circulating_supply.toLocaleString()} {crypto.symbol.toUpperCase()}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">7-day Price Chart</p>
            <div className="h-40">
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
          </div>
        </div>
      )}
    </Card>
  );
}