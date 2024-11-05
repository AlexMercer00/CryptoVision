"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import type { CryptoData } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CryptoListItemProps {
  crypto: CryptoData;
  timeRange?: string;
}

export function CryptoListItem({ crypto, timeRange = '24h' }: CryptoListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const priceChangeKey = `price_change_percentage_${timeRange}`;
  const priceChange = crypto[priceChangeKey] || crypto.price_change_percentage_24h;

  return (
    <Card className="overflow-hidden">
      <motion.div
        className="p-4 hover:bg-accent/50 transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        initial={false}
        animate={{ backgroundColor: isExpanded ? "var(--accent)" : "transparent" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image 
              src={crypto.image} 
              alt={crypto.name} 
              width={32}
              height={32}
              className="rounded-full"
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
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 180 : 0 }}
            >
              <ChevronDownIcon className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
              <div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}