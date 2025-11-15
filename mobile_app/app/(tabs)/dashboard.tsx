import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRobot } from '@/providers/RobotProvider';
import { theme } from '@/constants/theme';
import {
  Battery,
  MapPin,
  Thermometer,
  Droplets,
  Power,
  TrendingUp,
  AlertCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { robotStatus, telemetry, plantingProgress } = useRobot();

  const getBatteryColor = (level: number) => {
    if (level > 50) return theme.colors.success;
    if (level > 20) return theme.colors.warning;
    return theme.colors.danger;
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'autonomous':
        return theme.colors.primary;
      case 'manual':
        return theme.colors.secondary;
      case 'idle':
        return theme.colors.gray;
      case 'charging':
        return theme.colors.warning;
      default:
        return theme.colors.gray;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>AgriBot Control</Text>
            <Text style={styles.robotName}>{robotStatus.name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: robotStatus.isOnline ? theme.colors.success10 : theme.colors.danger10 }]}>
            <View style={[styles.statusDot, { backgroundColor: robotStatus.isOnline ? theme.colors.success : theme.colors.danger }]} />
            <Text style={[styles.statusText, { color: robotStatus.isOnline ? theme.colors.success : theme.colors.danger }]}>
              {robotStatus.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.mainCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.mainCardHeader}>
            <Text style={styles.mainCardTitle}>Robot Status</Text>
            <View style={[styles.modeBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.modeText}>{robotStatus.mode.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.mainCardContent}>
            <View style={styles.mainCardItem}>
              <Power size={32} color={theme.colors.white} />
              <Text style={styles.mainCardLabel}>Task</Text>
              <Text style={styles.mainCardValue}>{robotStatus.currentTask}</Text>
            </View>

            <View style={styles.mainCardDivider} />

            <View style={styles.mainCardItem}>
              <Battery size={32} color={theme.colors.white} />
              <Text style={styles.mainCardLabel}>Battery</Text>
              <Text style={styles.mainCardValue}>{robotStatus.batteryLevel}%</Text>
            </View>

            <View style={styles.mainCardDivider} />

            <View style={styles.mainCardItem}>
              <TrendingUp size={32} color={theme.colors.white} />
              <Text style={styles.mainCardLabel}>Speed</Text>
              <Text style={styles.mainCardValue}>{robotStatus.speed} m/s</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.success10 }]}>
              <TrendingUp size={24} color={theme.colors.success} />
            </View>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statValue}>{plantingProgress.percentComplete.toFixed(1)}%</Text>
            <Text style={styles.statSubtext}>
              {plantingProgress.completedArea.toFixed(0)} / {plantingProgress.totalArea} m²
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.warning10 }]}>
              <Thermometer size={24} color={theme.colors.warning} />
            </View>
            <Text style={styles.statLabel}>Temperature</Text>
            <Text style={styles.statValue}>{telemetry.temperature.toFixed(1)}°C</Text>
            <Text style={styles.statSubtext}>Optimal range</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.secondary + '20' }]}>
              <Droplets size={24} color={theme.colors.secondary} />
            </View>
            <Text style={styles.statLabel}>Humidity</Text>
            <Text style={styles.statValue}>{telemetry.humidity.toFixed(0)}%</Text>
            <Text style={styles.statSubtext}>Air moisture</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <MapPin size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.statLabel}>GPS Accuracy</Text>
            <Text style={styles.statValue}>{telemetry.gpsAccuracy.toFixed(2)}m</Text>
            <Text style={styles.statSubtext}>RTK enabled</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planting Session</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Seeds Planted</Text>
              <Text style={styles.cardValue}>{plantingProgress.seedsPlanted.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Holes Drilled</Text>
              <Text style={styles.cardValue}>{plantingProgress.holesDrilled.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>Average Depth</Text>
              <Text style={styles.cardValue}>{plantingProgress.averageDepth} cm</Text>
            </View>
          </View>
        </View>

        {robotStatus.batteryLevel < 30 && (
          <View style={styles.alertCard}>
            <AlertCircle size={20} color={theme.colors.warning} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Low Battery Warning</Text>
              <Text style={styles.alertText}>
                Robot battery is at {robotStatus.batteryLevel}%. Consider charging soon.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  robotName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  mainCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  mainCardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  modeBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  modeText: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  mainCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainCardItem: {
    flex: 1,
    alignItems: 'center',
  },
  mainCardLabel: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: theme.spacing.xs,
  },
  mainCardValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
    marginTop: 2,
  },
  mainCardDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: theme.spacing.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.lightGray,
  },
  section: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  cardValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.warning10,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  alertContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  alertTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.warning,
    marginBottom: 2,
  },
  alertText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
});
