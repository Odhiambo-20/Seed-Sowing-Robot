export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  farmName?: string;
  farmLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  role: 'farmer' | 'admin' | 'technician';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  preferences?: {
    notifications: boolean;
    language: string;
    units: 'metric' | 'imperial';
  };
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
    address?: string;
  };
  area: number;
  boundaries?: { latitude: number; longitude: number }[];
  cropType?: string;
  soilType?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Robot {
  id: string;
  userId: string;
  farmId?: string;
  name: string;
  serialNumber: string;
  model: string;
  firmwareVersion: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  registeredAt: string;
  lastMaintenanceAt?: string;
  nextMaintenanceAt?: string;
  totalHoursOperated: number;
  totalAreaCovered: number;
  totalSeedsPlanted: number;
}

export interface PlantingSession {
  id: string;
  userId: string;
  robotId: string;
  farmId: string;
  cropType: string;
  seedVariety?: string;
  targetArea: number;
  completedArea: number;
  totalSeeds: number;
  totalHoles: number;
  averageDepth: number;
  averageSpacing: number;
  startTime: string;
  endTime?: string;
  status: 'planned' | 'in_progress' | 'paused' | 'completed' | 'failed';
  weatherConditions?: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  batteryUsed: number;
  efficiency: number;
}

export interface SensorReading {
  id: string;
  robotId: string;
  sessionId?: string;
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  soilPH?: number;
  soilNPK?: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  lightIntensity?: number;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
  };
  batteryLevel: number;
  batteryVoltage: number;
  batteryTemperature?: number;
  motorTemperature?: number;
  signalStrength: number;
}

export interface Alert {
  id: string;
  userId: string;
  robotId?: string;
  sessionId?: string;
  type: 'error' | 'warning' | 'info' | 'critical';
  category: 'battery' | 'mechanical' | 'sensor' | 'navigation' | 'network' | 'task';
  title: string;
  message: string;
  details?: Record<string, any>;
  severity: 1 | 2 | 3 | 4 | 5;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolved: boolean;
  resolvedAt?: string;
  actionTaken?: string;
}

export interface Mission {
  id: string;
  userId: string;
  robotId: string;
  farmId: string;
  type: 'planting' | 'watering' | 'weeding' | 'pesticide' | 'survey';
  status: 'scheduled' | 'queued' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledStart: string;
  actualStart?: string;
  estimatedEnd?: string;
  actualEnd?: string;
  waypoints: {
    latitude: number;
    longitude: number;
    action?: string;
    params?: Record<string, any>;
  }[];
  progress: number;
  parameters?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceLog {
  id: string;
  robotId: string;
  userId: string;
  type: 'scheduled' | 'repair' | 'inspection' | 'upgrade';
  title: string;
  description: string;
  partsReplaced?: string[];
  technicianName?: string;
  cost?: number;
  timestamp: string;
  nextMaintenanceDate?: string;
  attachments?: string[];
}

export interface Report {
  id: string;
  userId: string;
  farmId?: string;
  robotId?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'session' | 'custom';
  title: string;
  generatedAt: string;
  periodStart: string;
  periodEnd: string;
  metrics: {
    areaCovered?: number;
    seedsPlanted?: number;
    hoursOperated?: number;
    fuelEfficiency?: number;
    averageSpeed?: number;
    alertsCount?: number;
    successRate?: number;
  };
  data: Record<string, any>;
  fileUrl?: string;
}

export interface DeviceToken {
  id: string;
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceModel?: string;
  osVersion?: string;
  appVersion?: string;
  createdAt: string;
  lastUsedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}
