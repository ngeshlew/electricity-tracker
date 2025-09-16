import { io, Socket } from 'socket.io-client';
import type { MeterReading } from './api';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

// Debug logging
console.log('🔌 SOCKET_URL:', SOCKET_URL);
console.log('🔌 VITE_SERVER_URL env var:', import.meta.env.VITE_SERVER_URL);

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to server');
      this.isConnected = true;
      this.joinMeterReadingsRoom();
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  private joinMeterReadingsRoom(): void {
    if (this.socket) {
      this.socket.emit('join-meter-readings');
    }
  }

  // Meter reading event listeners
  onMeterReadingAdded(callback: (reading: MeterReading) => void): void {
    if (this.socket) {
      this.socket.on('meter-reading-added', callback);
    }
  }

  onMeterReadingUpdated(callback: (reading: MeterReading) => void): void {
    if (this.socket) {
      this.socket.on('meter-reading-updated', callback);
    }
  }

  onMeterReadingDeleted(callback: (data: { id: string }) => void): void {
    if (this.socket) {
      this.socket.on('meter-reading-deleted', callback);
    }
  }

  // Remove event listeners
  offMeterReadingAdded(callback: (reading: MeterReading) => void): void {
    if (this.socket) {
      this.socket.off('meter-reading-added', callback);
    }
  }

  offMeterReadingUpdated(callback: (reading: MeterReading) => void): void {
    if (this.socket) {
      this.socket.off('meter-reading-updated', callback);
    }
  }

  offMeterReadingDeleted(callback: (data: { id: string }) => void): void {
    if (this.socket) {
      this.socket.off('meter-reading-deleted', callback);
    }
  }

  // Emit events
  emitMeterReadingAdded(reading: MeterReading): void {
    if (this.socket) {
      this.socket.emit('meter-reading-added', reading);
    }
  }

  emitMeterReadingUpdated(reading: MeterReading): void {
    if (this.socket) {
      this.socket.emit('meter-reading-updated', reading);
    }
  }

  emitMeterReadingDeleted(id: string): void {
    if (this.socket) {
      this.socket.emit('meter-reading-deleted', { id });
    }
  }

  // Connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Reconnect if disconnected
  reconnect(): void {
    if (!this.isConnected && this.socket) {
      this.socket.connect();
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();
export default socketService;
