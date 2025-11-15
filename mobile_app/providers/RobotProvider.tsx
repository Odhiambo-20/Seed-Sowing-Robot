import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { RobotStatus, TelemetryData, PlantingProgress, AlertData } from '@/types/robot';

const MOCK_ROBOT_ID = 'robot_001';

export const [RobotProvider, useRobot] = createContextHook(() => {
  const [robotStatus, setRobotStatus] = useState<RobotStatus>({
    id: MOCK_ROBOT_ID,
    name: 'AgriBot Alpha',
    mode: 'idle',
    currentTask: 'idle',
    isOnline: true,
    batteryLevel: 85,
    batteryVoltage: 47.2,
    isCharging: false,
    speed: 0,
    location: {
      latitude: -1.2921,
      longitude: 36.8219,
      altitude: 1795,
      accuracy: 0.05,
    },
    heading: 0,
    lastUpdate: new Date().toISOString(),
  });

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    timestamp: new Date().toISOString(),
    temperature: 24.5,
    humidity: 65,
    soilMoisture: 42,
    gpsAccuracy: 0.05,
    signalStrength: 85,
  });

  const [plantingProgress, setPlantingProgress] = useState<PlantingProgress>({
    sessionId: 'session_' + Date.now(),
    totalArea: 10000,
    completedArea: 0,
    percentComplete: 0,
    seedsPlanted: 0,
    holesDrilled: 0,
    averageDepth: 0,
    averageSpacing: 0,
    startTime: new Date().toISOString(),
  });

  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        timestamp: new Date().toISOString(),
        temperature: 24 + Math.random() * 4,
        humidity: 60 + Math.random() * 10,
        soilMoisture: 40 + Math.random() * 10,
      }));

      setRobotStatus(prev => ({
        ...prev,
        batteryLevel: Math.max(20, prev.batteryLevel - 0.01),
        lastUpdate: new Date().toISOString(),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const sendCommand = useCallback(async (command: string, params?: any) => {
    console.log('Sending command:', command, params);
    
    return { success: true };
  }, []);

  const emergencyStop = useCallback(async () => {
    console.log('EMERGENCY STOP TRIGGERED');
    setRobotStatus(prev => ({
      ...prev,
      mode: 'idle',
      speed: 0,
    }));
    
    return { success: true };
  }, []);

  const setRobotMode = useCallback((mode: RobotStatus['mode']) => {
    setRobotStatus(prev => ({ ...prev, mode }));
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const value = useMemo(() => ({
    robotStatus,
    telemetry,
    plantingProgress,
    alerts,
    sendCommand,
    emergencyStop,
    setRobotMode,
    acknowledgeAlert,
  }), [robotStatus, telemetry, plantingProgress, alerts, sendCommand, emergencyStop, setRobotMode, acknowledgeAlert]);

  return value;
});
