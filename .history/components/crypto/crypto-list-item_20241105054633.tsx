"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";
import type { CryptoData } from "@/lib/types";

interface CryptoListItemProps {
  crypto: CryptoData;
}

export function CryptoListItem({ crypto }: CryptoListItemProps) {
  return (
    <Card className="p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
              {crypto.price_change_percentage_24h > 0 ? (
                <ArrowUpIcon className="h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-red-500" />
              )}
              <span
                className={cn(
                  "text-sm",
                  crypto.price_change_percentage_24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                )}
              >
                {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
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
                  stroke={crypto.price_change_percentage_24h > 0 ? "#22c55e" : "#ef4444"}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}