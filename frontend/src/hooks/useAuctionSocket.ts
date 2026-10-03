import { useEffect } from 'react';
import { socket, connectSocket } from '../utils/socket';
import type { Bid } from '../types/auction';

export function useAuctionSocket(auctionId: string, onNewBid: (bid: Bid) => void) {
  useEffect(() => {
    if (!auctionId) return;

    connectSocket();
    socket.emit('joinAuction', auctionId);

    socket.on('newBid', (newBid: Bid) => {
      onNewBid(newBid);
    });

    return () => {
      socket.emit('leaveAuction', auctionId);
      socket.off('newBid');
    };
  }, [auctionId, onNewBid]);
}