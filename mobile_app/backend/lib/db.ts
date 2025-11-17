import { isDevelopment } from './aws-config';
import type { User, Robot, Farm, PlantingSession, Alert, SensorReading, Mission, MaintenanceLog, Report } from '@/types/database';

interface QueryOptions {
  limit?: number;
  startKey?: Record<string, any>;
  sortOrder?: 'asc' | 'desc';
}

class InMemoryDatabase {
  private users: Map<string, User> = new Map();
  private robots: Map<string, Robot> = new Map();
  private farms: Map<string, Farm> = new Map();
  private sessions: Map<string, PlantingSession> = new Map();
  private alerts: Map<string, Alert> = new Map();
  private telemetry: Map<string, SensorReading[]> = new Map();
  private missions: Map<string, Mission> = new Map();
  private maintenance: Map<string, MaintenanceLog> = new Map();
  private reports: Map<string, Report> = new Map();

  async getItem<T>(table: string, id: string): Promise<T | null> {
    const store = this.getStore(table);
    return store.get(id) as T || null;
  }

  async putItem<T>(table: string, item: T & { id: string }): Promise<void> {
    const store = this.getStore(table);
    store.set(item.id, item);
  }

  async updateItem<T>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
    const store = this.getStore(table);
    const existing = store.get(id);
    if (!existing) return null;
    
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    store.set(id, updated);
    return updated as T;
  }

  async deleteItem(table: string, id: string): Promise<boolean> {
    const store = this.getStore(table);
    return store.delete(id);
  }

  async query<T>(table: string, filter: (item: T) => boolean, options?: QueryOptions): Promise<T[]> {
    const store = this.getStore(table);
    let results: T[] = [];
    
    for (const item of store.values()) {
      if (filter(item as T)) {
        results.push(item as T);
      }
    }

    if (options?.sortOrder === 'desc') {
      results.reverse();
    }

    if (options?.limit) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getRobotsByUserId(userId: string): Promise<Robot[]> {
    return this.query<Robot>('robots', (robot) => robot.userId === userId);
  }

  async getAlertsByUserId(userId: string, unacknowledgedOnly = false): Promise<Alert[]> {
    return this.query<Alert>('alerts', (alert) => {
      if (alert.userId !== userId) return false;
      if (unacknowledgedOnly && alert.acknowledged) return false;
      return true;
    });
  }

  async getTelemetryByRobotId(robotId: string, limit = 100): Promise<SensorReading[]> {
    const readings = this.telemetry.get(robotId) || [];
    return readings.slice(-limit);
  }

  async addTelemetry(robotId: string, reading: SensorReading): Promise<void> {
    const readings = this.telemetry.get(robotId) || [];
    readings.push(reading);
    if (readings.length > 10000) {
      readings.shift();
    }
    this.telemetry.set(robotId, readings);
  }

  private getStore(table: string): Map<string, any> {
    switch (table) {
      case 'users': return this.users;
      case 'robots': return this.robots;
      case 'farms': return this.farms;
      case 'sessions': return this.sessions;
      case 'alerts': return this.alerts;
      case 'missions': return this.missions;
      case 'maintenance': return this.maintenance;
      case 'reports': return this.reports;
      default: throw new Error(`Unknown table: ${table}`);
    }
  }

  async initializeMockData(): Promise<void> {
    const mockUser: User = {
      id: 'user_001',
      email: 'farmer@example.com',
      name: 'John Farm',
      farmName: 'Green Valley Farm',
      farmLocation: {
        latitude: -1.2921,
        longitude: 36.8219,
        address: 'Nairobi, Kenya',
      },
      role: 'farmer',
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        language: 'en',
        units: 'metric',
      },
    };

    const mockRobot: Robot = {
      id: 'robot_001',
      userId: 'user_001',
      name: 'AgriBot Alpha',
      serialNumber: 'SRB-2024-001',
      model: 'SeedBot Pro X1',
      firmwareVersion: '2.5.1',
      status: 'active',
      registeredAt: new Date().toISOString(),
      totalHoursOperated: 245,
      totalAreaCovered: 1250,
      totalSeedsPlanted: 125000,
    };

    await this.putItem('users', mockUser);
    await this.putItem('robots', mockRobot);

    console.log(' Mock data initialized');
  }
}

class DynamoDBDatabase {
  async getItem<T>(table: string, id: string): Promise<T | null> {
    console.log(`[DynamoDB] Getting item from ${table}: ${id}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async putItem<T>(table: string, item: T): Promise<void> {
    console.log(`[DynamoDB] Putting item to ${table}`, item);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async updateItem<T>(table: string, id: string, updates: Partial<T>): Promise<T | null> {
    console.log(`[DynamoDB] Updating item in ${table}: ${id}`, updates);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async deleteItem(table: string, id: string): Promise<boolean> {
    console.log(`[DynamoDB] Deleting item from ${table}: ${id}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async query<T>(table: string, filter: (item: T) => boolean, options?: QueryOptions): Promise<T[]> {
    console.log(`[DynamoDB] Querying ${table}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async getUserByEmail(email: string): Promise<User | null> {
    console.log(`[DynamoDB] Getting user by email: ${email}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async getRobotsByUserId(userId: string): Promise<Robot[]> {
    console.log(`[DynamoDB] Getting robots by user ID: ${userId}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async getAlertsByUserId(userId: string, unacknowledgedOnly = false): Promise<Alert[]> {
    console.log(`[DynamoDB] Getting alerts by user ID: ${userId}, unacknowledged only: ${unacknowledgedOnly}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async getTelemetryByRobotId(robotId: string, limit = 100): Promise<SensorReading[]> {
    console.log(`[DynamoDB] Getting telemetry by robot ID: ${robotId}, limit: ${limit}`);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }

  async addTelemetry(robotId: string, reading: SensorReading): Promise<void> {
    console.log(`[DynamoDB] Adding telemetry for robot ID: ${robotId}`, reading);
    throw new Error('DynamoDB not configured. Set AWS_COGNITO_USER_POOL_ID to enable.');
  }
}

const inMemoryDb = new InMemoryDatabase();

if (isDevelopment) {
  inMemoryDb.initializeMockData().catch(console.error);
}

export const db = isDevelopment ? inMemoryDb : new DynamoDBDatabase();