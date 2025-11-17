import { awsConfig, isDevelopment } from './aws-config';

interface IoTMessage {
  type: string;
  robotId: string;
  timestamp: string;
  data: Record<string, any>;
}

class MockIoTCore {
  private connections: Map<string, any> = new Map();
  private messageHandlers: Map<string, ((message: IoTMessage) => void)[]> = new Map();

  async connect(robotId: string): Promise<boolean> {
    console.log('[IoT] Mock connecting to robot:', robotId);
    this.connections.set(robotId, { connected: true, lastSeen: new Date() });
    return true;
  }

  async disconnect(robotId: string): Promise<void> {
    console.log('[IoT] Mock disconnecting from robot:', robotId);
    this.connections.delete(robotId);
  }

  async publishCommand(robotId: string, command: string, params?: Record<string, any>): Promise<boolean> {
    console.log('[IoT] Mock publishing command:', { robotId, command, params });
    
    const message: IoTMessage = {
      type: 'command',
      robotId,
      timestamp: new Date().toISOString(),
      data: { command, params },
    };

    const handlers = this.messageHandlers.get(robotId) || [];
    handlers.forEach(handler => handler(message));

    return true;
  }

  async getDeviceShadow(robotId: string): Promise<Record<string, any>> {
    console.log('[IoT] Mock getting device shadow:', robotId);
    
    return {
      state: {
        reported: {
          online: true,
          batteryLevel: 85,
          mode: 'idle',
          location: {
            latitude: -1.2921,
            longitude: 36.8219,
          },
          lastUpdate: new Date().toISOString(),
        },
      },
    };
  }

  async updateDeviceShadow(robotId: string, state: Record<string, any>): Promise<boolean> {
    console.log('[IoT] Mock updating device shadow:', { robotId, state });
    return true;
  }

  subscribe(robotId: string, handler: (message: IoTMessage) => void): void {
    const handlers = this.messageHandlers.get(robotId) || [];
    handlers.push(handler);
    this.messageHandlers.set(robotId, handlers);
    console.log('[IoT] Subscribed to robot updates:', robotId);
  }

  unsubscribe(robotId: string, handler: (message: IoTMessage) => void): void {
    const handlers = this.messageHandlers.get(robotId) || [];
    const filtered = handlers.filter(h => h !== handler);
    this.messageHandlers.set(robotId, filtered);
    console.log('[IoT] Unsubscribed from robot updates:', robotId);
  }

  isConnected(robotId: string): boolean {
    return this.connections.has(robotId);
  }
}

class ProductionIoTCore {
  async connect(robotId: string): Promise<boolean> {
    console.log('[IoT] Connecting to AWS IoT Core:', robotId);
    throw new Error('AWS IoT Core not configured. Set AWS_IOT_ENDPOINT to enable.');
  }

  async disconnect(robotId: string): Promise<void> {
    console.log('[IoT] Disconnecting from AWS IoT Core:', robotId);
    throw new Error('AWS IoT Core not configured.');
  }

  async publishCommand(robotId: string, command: string, params?: Record<string, any>): Promise<boolean> {
    console.log('[IoT] Publishing to AWS IoT Core:', { robotId, command, params });
    throw new Error('AWS IoT Core not configured.');
  }

  async getDeviceShadow(robotId: string): Promise<Record<string, any>> {
    console.log('[IoT] Getting device shadow from AWS IoT Core:', robotId);
    throw new Error('AWS IoT Core not configured.');
  }

  async updateDeviceShadow(robotId: string, state: Record<string, any>): Promise<boolean> {
    console.log('[IoT] Updating device shadow in AWS IoT Core:', { robotId, state });
    throw new Error('AWS IoT Core not configured.');
  }

  subscribe(robotId: string, handler: (message: IoTMessage) => void): void {
    console.log('[IoT] Subscribing to AWS IoT Core topic:', robotId);
    throw new Error('AWS IoT Core not configured.');
  }

  unsubscribe(robotId: string, handler: (message: IoTMessage) => void): void {
    console.log('[IoT] Unsubscribing from AWS IoT Core topic:', robotId);
    throw new Error('AWS IoT Core not configured.');
  }

  isConnected(robotId: string): boolean {
    return false;
  }
}

export const iotCore = isDevelopment ? new MockIoTCore() : new ProductionIoTCore();

export type { IoTMessage };
