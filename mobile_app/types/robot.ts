export type RobotMode = 'idle' | 'manual' | 'autonomous' | 'returning' | 'charging';

export type RobotTask = 'planting' | 'watering' | 'weeding' | 'pesticide' | 'idle';

export interface RobotStatus {
  id: string;
  name: string;
  mode: RobotMode;
  currentTask: RobotTask;
  isOnline: boolean;
  batteryLevel: number;
  batteryVoltage: number;
  isCharging: boolean;
  speed: number;
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
    accuracy: number;
  };
  heading: number;
  lastUpdate: string;
}

export interface TelemetryData {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  gpsAccuracy: number;
  signalStrength: number;
}

export interface PlantingProgress {
  sessionId: string;
  totalArea: number;
  completedArea: number;
  percentComplete: number;
  seedsPlanted: number;
  holesDrilled: number;
  averageDepth: number;
  averageSpacing: number;
  startTime: string;
  estimatedCompletion?: string;
}

export interface AlertData {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ControlCommand {
  type: 'movement' | 'task' | 'mode' | 'emergency';
  action: string;
  params?: Record<string, any>;
}
