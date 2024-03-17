"use client";

import React, { useState, useEffect } from "react";
import TicketCard from "./TicketCard";
import NewTask from "./NewTask";
import SearchBar from "./SearchBar";
import { useSession } from "next-auth/react";

const getCurrData = async (stockSymbol) => {
  const response = await fetch(
    `api/latest?symbol=${encodeURIComponent(stockSymbol)}`
  );

  if (response.ok) {
    const { data } = await response.json();
    const bodyValue = data.body;
    const stockInfo = {
      stock_name: stockSymbol,
      current_price: bodyValue,
    };
    return stockInfo;
  } else {
    console.error("Error:", response.status);
  }
};

const StockBoard = () => {
  const [stockData, setStockData] = useState([]);
  const { data: session, status, update } = useSession();

  let allStocks = session?.user?.stocks;
  console.log("all stocks:", { allStocks });
  console.log("session", { session });
  useEffect(() => {
    const fetchStockData = async () => {
      const promises = allStocks?.map((stock) => getCurrData(stock));
      // add check to make sure is array
      if (Array.isArray(promises)) {
        const data = await Promise.all(promises);
        setStockData(data);
      }
    };

    fetchStockData();
  }, [allStocks]);

  return (
    <div className="p-5">
      <div className="flex flex-col pl-2">
        <div className="flex flex-row gap-4">
          <h3 className="text-white">Your stocks</h3>
          <NewTask />
          <SearchBar setTicketState={[stockData, setStockData]} />
        </div>
      </div>
      <div className="lg:grid grid-cols-2 xl:grid-cols-4">
        {stockData.map((ticket, index) => (
          <TicketCard
            id={index}
            key={index}
            ticket={ticket}
            setTicketState={[stockData, setStockData]}
          />
        ))}
      </div>
    </div>
  );
};

export default StockBoard;
