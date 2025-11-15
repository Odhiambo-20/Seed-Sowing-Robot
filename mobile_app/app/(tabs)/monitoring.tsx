import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRobot } from '@/providers/RobotProvider';
import { theme } from '@/constants/theme';
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  TrendingUp,
  Battery,
  Wifi,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - theme.spacing.md * 4;

export default function MonitoringScreen() {
  const { robotStatus, telemetry, plantingProgress, alerts } = useRobot();

  const getMockChartData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      value: 20 + Math.random() * 10,
      timestamp: Date.now() - (20 - i) * 60000,
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Environmental Monitor</Text>
          <Text style={styles.subtitle}>Real-time field conditions</Text>
        </View>

        <LinearGradient
          colors={[theme.colors.warning, '#fb923c']}
          style={styles.mainCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.mainCardContent}>
            <Thermometer size={48} color={theme.colors.white} />
            <View>
              <Text style={styles.mainCardLabel}>Temperature</Text>
              <Text style={styles.mainCardValue}>{telemetry.temperature.toFixed(1)}°C</Text>
            </View>
          </View>
          <Text style={styles.mainCardSubtext}>Last updated: {new Date().toLocaleTimeString()}</Text>
        </LinearGradient>

        <View style={styles.grid}>
          <View style={[styles.card, { backgroundColor: theme.colors.secondary + '10' }]}>
            <Droplets size={32} color={theme.colors.secondary} />
            <Text style={styles.cardLabel}>Humidity</Text>
            <Text style={[styles.cardValue, { color: theme.colors.secondary }]}>
              {telemetry.humidity.toFixed(0)}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${telemetry.humidity}%`, backgroundColor: theme.colors.secondary }]} />
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.primary + '10' }]}>
            <Wind size={32} color={theme.colors.primary} />
            <Text style={styles.cardLabel}>Soil Moisture</Text>
            <Text style={[styles.cardValue, { color: theme.colors.primary }]}>
              {telemetry.soilMoisture.toFixed(0)}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${telemetry.soilMoisture}%`, backgroundColor: theme.colors.primary }]} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Robot Telemetry</Text>
          
          <View style={styles.telemetryCard}>
            <View style={styles.telemetryRow}>
              <View style={styles.telemetryItem}>
                <Battery size={20} color={theme.colors.success} />
                <Text style={styles.telemetryLabel}>Battery</Text>
              </View>
              <Text style={styles.telemetryValue}>{robotStatus.batteryLevel}%</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.telemetryRow}>
              <View style={styles.telemetryItem}>
                <Gauge size={20} color={theme.colors.secondary} />
                <Text style={styles.telemetryLabel}>Speed</Text>
              </View>
              <Text style={styles.telemetryValue}>{robotStatus.speed.toFixed(1)} m/s</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.telemetryRow}>
              <View style={styles.telemetryItem}>
                <Wifi size={20} color={theme.colors.primary} />
                <Text style={styles.telemetryLabel}>Signal</Text>
              </View>
              <Text style={styles.telemetryValue}>{telemetry.signalStrength}%</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.telemetryRow}>
              <View style={styles.telemetryItem}>
                <TrendingUp size={20} color={theme.colors.warning} />
                <Text style={styles.telemetryLabel}>GPS Accuracy</Text>
              </View>
              <Text style={styles.telemetryValue}>{telemetry.gpsAccuracy.toFixed(2)}m</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Progress</Text>
          
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Area Coverage</Text>
              <Text style={styles.progressPercent}>{plantingProgress.percentComplete.toFixed(1)}%</Text>
            </View>
            <View style={styles.progressBarLarge}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.success]}
                style={[styles.progressFillLarge, { width: `${plantingProgress.percentComplete}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressSubtext}>
              {plantingProgress.completedArea.toFixed(0)} / {plantingProgress.totalArea} m²
            </Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{plantingProgress.seedsPlanted.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Seeds Planted</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{plantingProgress.holesDrilled.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Holes Drilled</Text>
            </View>
          </View>
        </View>

        {alerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            {alerts.slice(0, 3).map((alert) => (
              <View
                key={alert.id}
                style={[
                  styles.alertCard,
                  {
                    backgroundColor:
                      alert.type === 'error'
                        ? theme.colors.danger10
                        : alert.type === 'warning'
                        ? theme.colors.warning10
                        : theme.colors.success10,
                    borderLeftColor:
                      alert.type === 'error'
                        ? theme.colors.danger
                        : alert.type === 'warning'
                        ? theme.colors.warning
                        : theme.colors.success,
                  },
                ]}
              >
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertTime}>{new Date(alert.timestamp).toLocaleTimeString()}</Text>
              </View>
            ))}
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
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  header: {
    paddingVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  mainCard: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  mainCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  mainCardLabel: {
    fontSize: theme.fontSize.md,
    color: 'rgba(255,255,255,0.9)',
  },
  mainCardValue: {
    fontSize: theme.fontSize.xxxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  mainCardSubtext: {
    fontSize: theme.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  grid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  card: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  cardLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  cardValue: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    marginTop: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
  telemetryCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  telemetryLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  telemetryValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  progressCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  progressPercent: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  progressBarLarge: {
    height: 12,
    backgroundColor: theme.colors.veryLightGray,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFillLarge: {
    height: '100%',
    borderRadius: 6,
  },
  progressSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  alertCard: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    marginBottom: theme.spacing.sm,
  },
  alertTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  alertMessage: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  alertTime: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.lightGray,
  },
});
