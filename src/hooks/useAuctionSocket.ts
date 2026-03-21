"use client";

import { useEffect, useRef, useState } from "react";
import PartySocket from "partysocket";

const PARTY_HOST = process.env.NEXT_PUBLIC_PARTY_HOST || "localhost:1999";
const PARTY_NAME = "auction";

type BidUpdate = {
    type: "new-bid";
    amount: number;
    bidderId: string;
    bidderName: string;
    timestamp: string;
};

type AuctionEnd = {
    type: "auction-ended";
    winnerId: string;
    winningBid: number;
};

type ConnectionUpdate = {
    type: "connected";
    connections: number;
};

type AuctionMessage = BidUpdate | AuctionEnd | ConnectionUpdate;

export function useAuctionSocket(auctionId: string | null) {
    const [currentBid, setCurrentBid] = useState<number | null>(null);
    const [bidHistory, setBidHistory] = useState<BidUpdate[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [liveViewers, setLiveViewers] = useState(0);
    const [auctionEnded, setAuctionEnded] = useState(false);
    const socketRef = useRef<PartySocket | null>(null);

    useEffect(() => {
        if (!auctionId) return;

        setCurrentBid(null);
        setBidHistory([]);
        setAuctionEnded(false);

        const socket = new PartySocket({
            host: PARTY_HOST,
            party: PARTY_NAME,
            room: `auction-${auctionId}`,
        });

        socket.addEventListener("open", () => setIsConnected(true));
        socket.addEventListener("close", () => setIsConnected(false));

        socket.addEventListener("message", (event) => {
            try {
                const data: AuctionMessage = JSON.parse(event.data);

                switch (data.type) {
                    case "new-bid":
                        setCurrentBid(data.amount);
                        setBidHistory((prev) => [data, ...prev]);
                        break;
                    case "auction-ended":
                        setAuctionEnded(true);
                        break;
                    case "connected":
                        setLiveViewers(data.connections);
                        break;
                }
            } catch (e) {
                console.error("Failed to parse auction message:", e);
            }
        });

        socketRef.current = socket;

        return () => {
            socket.close();
        };
    }, [auctionId]);

    return { currentBid, bidHistory, isConnected, liveViewers, auctionEnded };
}
