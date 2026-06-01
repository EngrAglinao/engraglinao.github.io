import { useEffect, useRef, useState, useCallback } from 'react';
import Peer, { DataConnection } from 'peerjs';
import type { GameState, NetworkMessage, Player } from '../types/game';

interface UseNetworkOptions {
  isHost: boolean;
  roomCode: string;
  myPlayer: Player;
  onGameStateUpdate: (state: GameState) => void;
  onPlayerJoin?: (player: Player) => void;
  onPlayerDisconnect?: (playerId: string) => void;
}

interface UseNetworkReturn {
  isConnected: boolean;
  connectionError: string | null;
  broadcastGameState: (state: GameState) => void;
  sendToHost: (msg: NetworkMessage) => void;
  connectedPeerIds: string[];
  myPeerId: string | null;
}

export function useNetwork({
  isHost,
  roomCode,
  myPlayer,
  onGameStateUpdate,
  onPlayerJoin,
  onPlayerDisconnect,
}: UseNetworkOptions): UseNetworkReturn {
  const peerRef = useRef<Peer | null>(null);
  // Host: map of peerId -> DataConnection (players connected to host)
  const playerConnsRef = useRef<Map<string, DataConnection>>(new Map());
  // Player: connection to host
  const hostConnRef = useRef<DataConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectedPeerIds, setConnectedPeerIds] = useState<string[]>([]);
  const [myPeerId, setMyPeerId] = useState<string | null>(null);

  const callbacksRef = useRef({ onGameStateUpdate, onPlayerJoin, onPlayerDisconnect });
  callbacksRef.current = { onGameStateUpdate, onPlayerJoin, onPlayerDisconnect };

  const updateConnectedPeers = useCallback(() => {
    setConnectedPeerIds(Array.from(playerConnsRef.current.keys()));
  }, []);

  const handleData = useCallback((data: unknown) => {
    const msg = data as NetworkMessage;
    if (msg.type === 'GAME_STATE') {
      callbacksRef.current.onGameStateUpdate(msg.state);
    } else if (msg.type === 'PLAYER_JOIN') {
      callbacksRef.current.onPlayerJoin?.(msg.player);
    }
  }, []);

  const setupPlayerConnection = useCallback(
    (conn: DataConnection) => {
      conn.on('open', () => {
        playerConnsRef.current.set(conn.peer, conn);
        updateConnectedPeers();
      });
      conn.on('data', (data) => {
        handleData(data);
      });
      conn.on('close', () => {
        playerConnsRef.current.delete(conn.peer);
        updateConnectedPeers();
        callbacksRef.current.onPlayerDisconnect?.(conn.peer);
      });
      conn.on('error', () => {
        playerConnsRef.current.delete(conn.peer);
        updateConnectedPeers();
      });
    },
    [handleData, updateConnectedPeers]
  );

  const setupHostConnection = useCallback(
    (conn: DataConnection) => {
      conn.on('open', () => {
        hostConnRef.current = conn;
        setIsConnected(true);
        setConnectionError(null);
        // Announce ourselves to the host
        conn.send({ type: 'PLAYER_JOIN', player: myPlayer } as NetworkMessage);
      });
      conn.on('data', (data) => {
        handleData(data);
      });
      conn.on('close', () => {
        hostConnRef.current = null;
        setIsConnected(false);
        setConnectionError('Disconnected from host.');
      });
      conn.on('error', (err) => {
        console.error('Host conn error:', err);
        setConnectionError('Connection to host lost.');
      });
    },
    [myPlayer, handleData]
  );

  useEffect(() => {
    // Use a stable peer ID: host uses the room code, players use their player ID
    const peerId = isHost
      ? `avalon-host-${roomCode}`
      : `avalon-player-${myPlayer.id.replace(/-/g, '')}`;

    const peer = new Peer(peerId, {
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' },
        ],
      },
      debug: 0,
    });

    peerRef.current = peer;

    peer.on('open', (id) => {
      setMyPeerId(id);
      if (isHost) {
        setIsConnected(true);
        setConnectionError(null);
      } else {
        // Connect to host
        const hostPeerId = `avalon-host-${roomCode}`;
        const conn = peer.connect(hostPeerId, {
          reliable: true,
          serialization: 'json',
        });
        setupHostConnection(conn);
      }
    });

    if (isHost) {
      peer.on('connection', (conn) => {
        setupPlayerConnection(conn);
      });
    }

    peer.on('error', (err: Error & { type?: string }) => {
      console.error('Peer error:', err.type, err.message);
      if (err.type === 'unavailable-id') {
        // ID already taken, try with suffix
        setConnectionError('Room ID conflict. Please try again.');
      } else if (err.type === 'peer-unavailable') {
        setConnectionError(
          'Room not found. Make sure the room code is correct and the host is connected.'
        );
      } else if (err.type === 'network' || err.type === 'server-error') {
        setConnectionError(
          'Network error. Ensure all devices are on the same WiFi and try again.'
        );
      } else {
        setConnectionError(`Connection error: ${err.message}`);
      }
    });

    peer.on('disconnected', () => {
      if (!peer.destroyed) {
        setTimeout(() => peer.reconnect(), 1000);
      }
    });

    return () => {
      playerConnsRef.current.forEach((conn) => conn.close());
      playerConnsRef.current.clear();
      hostConnRef.current?.close();
      peer.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHost, roomCode, myPlayer.id]);

  const broadcastGameState = useCallback((state: GameState) => {
    const msg: NetworkMessage = { type: 'GAME_STATE', state };
    playerConnsRef.current.forEach((conn) => {
      if (conn.open) {
        try { conn.send(msg); } catch { /* ignore */ }
      }
    });
  }, []);

  const sendToHost = useCallback((msg: NetworkMessage) => {
    if (hostConnRef.current?.open) {
      try { hostConnRef.current.send(msg); } catch { /* ignore */ }
    }
  }, []);

  return {
    isConnected,
    connectionError,
    broadcastGameState,
    sendToHost,
    connectedPeerIds,
    myPeerId,
  };
}
