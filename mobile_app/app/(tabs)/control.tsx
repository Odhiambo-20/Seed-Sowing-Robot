import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useRobot } from '@/providers/RobotProvider';
import { theme } from '@/constants/theme';
import {
  Circle,
  Square,
  Play,
  Pause,
  RotateCcw,
  AlertOctagon,
  Zap,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const JOYSTICK_SIZE = 150;
const KNOB_SIZE = 60;
const MAX_DISTANCE = (JOYSTICK_SIZE - KNOB_SIZE) / 2;

export default function ControlScreen() {
  const { robotStatus, sendCommand, emergencyStop, setRobotMode } = useRobot();
  const [speed, setSpeed] = useState(50);
  const pan = useRef(new Animated.ValueXY()).current;
  const [joystickActive, setJoystickActive] = useState(false);

  const handleEmergencyStop = useCallback(async () => {
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    
    Alert.alert(
      'Emergency Stop',
      'Are you sure you want to stop the robot immediately?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'STOP',
          style: 'destructive',
          onPress: async () => {
            await emergencyStop();
            Alert.alert('Success', 'Robot stopped successfully');
          },
        },
      ]
    );
  }, [emergencyStop]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setJoystickActive(true);
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
      onPanResponderMove: (_, gesture) => {
        const distance = Math.sqrt(gesture.dx ** 2 + gesture.dy ** 2);
        
        if (distance <= MAX_DISTANCE) {
          pan.setValue({ x: gesture.dx, y: gesture.dy });
        } else {
          const angle = Math.atan2(gesture.dy, gesture.dx);
          const x = Math.cos(angle) * MAX_DISTANCE;
          const y = Math.sin(angle) * MAX_DISTANCE;
          pan.setValue({ x, y });
        }

        const normalizedX = gesture.dx / MAX_DISTANCE;
        const normalizedY = -gesture.dy / MAX_DISTANCE;
        
        sendCommand('movement', { x: normalizedX, y: normalizedY, speed: speed / 100 });
      },
      onPanResponderRelease: () => {
        setJoystickActive(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        
        sendCommand('movement', { x: 0, y: 0, speed: 0 });
        
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
    })
  ).current;

  const handleModeChange = useCallback(async (mode: 'manual' | 'autonomous' | 'idle') => {
    if (Platform.OS !== 'web') {
      await Haptics.selectionAsync();
    }
    setRobotMode(mode);
  }, [setRobotMode]);

  const handleTaskStart = useCallback((task: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Alert.alert('Start Task', `Start ${task} task?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start',
        onPress: () => {
          sendCommand('task', { action: 'start', task });
          Alert.alert('Success', `${task} task started`);
        },
      },
    ]);
  }, [sendCommand]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Robot Control</Text>
        <View style={[styles.statusBadge, { backgroundColor: robotStatus.mode === 'manual' ? theme.colors.secondary + '20' : theme.colors.gray + '20' }]}>
          <Text style={[styles.statusText, { color: robotStatus.mode === 'manual' ? theme.colors.secondary : theme.colors.gray }]}>
            {robotStatus.mode.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Control Mode</Text>
          <View style={styles.modeGrid}>
            <TouchableOpacity
              style={[styles.modeButton, robotStatus.mode === 'manual' && styles.modeButtonActive]}
              onPress={() => handleModeChange('manual')}
            >
              <Circle size={24} color={robotStatus.mode === 'manual' ? theme.colors.white : theme.colors.secondary} />
              <Text style={[styles.modeButtonText, robotStatus.mode === 'manual' && styles.modeButtonTextActive]}>
                Manual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, robotStatus.mode === 'autonomous' && styles.modeButtonActive]}
              onPress={() => handleModeChange('autonomous')}
            >
              <Zap size={24} color={robotStatus.mode === 'autonomous' ? theme.colors.white : theme.colors.primary} />
              <Text style={[styles.modeButtonText, robotStatus.mode === 'autonomous' && styles.modeButtonTextActive]}>
                Auto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeButton, robotStatus.mode === 'idle' && styles.modeButtonActive]}
              onPress={() => handleModeChange('idle')}
            >
              <Pause size={24} color={robotStatus.mode === 'idle' ? theme.colors.white : theme.colors.gray} />
              <Text style={[styles.modeButtonText, robotStatus.mode === 'idle' && styles.modeButtonTextActive]}>
                Idle
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Joystick Control</Text>
          <View style={styles.joystickContainer}>
            <View style={styles.joystickBase}>
              <View style={styles.joystickCrosshair}>
                <View style={styles.crosshairLine} />
                <View style={[styles.crosshairLine, styles.crosshairLineVertical]} />
              </View>
              <Animated.View
                style={[
                  styles.joystickKnob,
                  {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                  },
                  joystickActive && styles.joystickKnobActive,
                ]}
                {...panResponder.panHandlers}
              >
                <View style={styles.joystickKnobInner} />
              </Animated.View>
            </View>
            <Text style={styles.joystickHint}>Drag to move robot</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Speed Control</Text>
          <View style={styles.speedContainer}>
            <Text style={styles.speedLabel}>{speed}%</Text>
            <View style={styles.speedButtons}>
              <TouchableOpacity
                style={styles.speedButton}
                onPress={() => setSpeed(Math.max(0, speed - 10))}
              >
                <Text style={styles.speedButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.speedButton}
                onPress={() => setSpeed(Math.min(100, speed + 10))}
              >
                <Text style={styles.speedButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tasks</Text>
          <View style={styles.taskGrid}>
            <TouchableOpacity style={styles.taskButton} onPress={() => handleTaskStart('planting')}>
              <Text style={styles.taskButtonText}>🌱 Planting</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskButton} onPress={() => handleTaskStart('watering')}>
              <Text style={styles.taskButtonText}>💧 Watering</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskButton} onPress={() => handleTaskStart('weeding')}>
              <Text style={styles.taskButtonText}>🌿 Weeding</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.taskButton} onPress={() => handleTaskStart('pesticide')}>
              <Text style={styles.taskButtonText}>🧪 Pesticide</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyStop}>
          <AlertOctagon size={28} color={theme.colors.white} />
          <Text style={styles.emergencyButtonText}>EMERGENCY STOP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  modeGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    gap: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  modeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  modeButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  modeButtonTextActive: {
    color: theme.colors.white,
  },
  joystickContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  joystickBase: {
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    borderRadius: JOYSTICK_SIZE / 2,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  joystickCrosshair: {
    position: 'absolute' as const,
    width: JOYSTICK_SIZE,
    height: JOYSTICK_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crosshairLine: {
    position: 'absolute' as const,
    width: JOYSTICK_SIZE - 40,
    height: 1,
    backgroundColor: theme.colors.veryLightGray,
  },
  crosshairLineVertical: {
    width: 1,
    height: JOYSTICK_SIZE - 40,
  },
  joystickKnob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  joystickKnobActive: {
    backgroundColor: theme.colors.primaryDark,
  },
  joystickKnobInner: {
    width: KNOB_SIZE - 20,
    height: KNOB_SIZE - 20,
    borderRadius: (KNOB_SIZE - 20) / 2,
    backgroundColor: theme.colors.white,
  },
  joystickHint: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  speedContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  speedLabel: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  speedButton: {
    width: 48,
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButtonText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  taskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  taskButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  taskButtonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  emergencyButton: {
    backgroundColor: theme.colors.danger,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    ...theme.shadows.lg,
  },
  emergencyButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
});
