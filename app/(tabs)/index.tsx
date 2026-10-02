import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { getProfile } from '@/lib/profiles';

export default function Index() {
  const [studentName, setStudentName] =
    useState('Student');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  // ============================================
  // LOAD PROFILE
  // ============================================

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStudentName('Student');
        return;
      }

      const { data, error } =
        await getProfile(user.id);

      if (error) {
        console.log(
          'PROFILE ERROR:',
          error.message
        );

        setStudentName('Student');
        return;
      }

      setStudentName(
        data?.full_name?.trim() ||
          user.email?.split('@')[0] ||
          'Student'
      );
    } catch (error: any) {
      console.log(
        'PROFILE ERROR:',
        error?.message
      );

      setStudentName('Student');
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // REFRESH
  // ============================================

  const refresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  // ============================================
  // SCREEN FOCUS
  // ============================================

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  // ============================================
  // LOADING SCREEN
  // ============================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>
            QR
          </Text>
        </View>

        <View style={styles.loadingDots}>
          <ActivityIndicator
            size="small"
            color="#2563eb"
          />
        </View>

        <Text style={styles.loadingTitle}>
          QR Attendance
        </Text>

        <Text style={styles.loadingText}>
          Preparing your dashboard...
        </Text>
      </View>
    );
  }

  // ============================================
  // HOME
  // ============================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={['#2563eb']}
          tintColor="#2563eb"
        />
      }
    >
      {/* ========================================
          HERO SECTION
      ======================================== */}

      <View style={styles.hero}>
        {/* Decorative background */}

        <View style={styles.heroGlowOne} />
        <View style={styles.heroGlowTwo} />
        <View style={styles.heroCircle} />

        <View style={styles.heroContent}>
          {/* TOP BAR */}

          <View style={styles.topBar}>
            <View>
              <View style={styles.welcomeRow}>
                <View style={styles.onlineDot} />

                <Text style={styles.welcomeText}>
                  STUDENT PORTAL
                </Text>
              </View>

              <Text
                style={styles.studentName}
                numberOfLines={1}
              >
                Hi, {studentName} 👋
              </Text>
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={() =>
                router.push('/profile')
              }
              activeOpacity={0.8}
            >
              <Text style={styles.profileEmoji}>
                👤
              </Text>
            </TouchableOpacity>
          </View>

          {/* HERO MESSAGE */}

          <View style={styles.heroMessage}>
            <Text style={styles.heroSmallTitle}>
              YOUR ATTENDANCE
            </Text>

            <Text style={styles.heroTitle}>
              Stay present.
              {'\n'}
              Stay connected.
            </Text>

            <Text style={styles.heroSubtitle}>
              Quickly check in to your school
              events using a QR code.
            </Text>
          </View>

          {/* FLOATING QR VISUAL */}

          <View style={styles.floatingQR}>
            <View style={styles.qrOuter}>
              <View style={styles.qrInner}>
                <Text style={styles.qrText}>
                  QR
                </Text>
              </View>
            </View>

            <View style={styles.qrScanLine} />
          </View>
        </View>
      </View>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <View style={styles.content}>
        {/* ======================================
            QUICK STATUS
        ====================================== */}

        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View style={styles.statusIcon}>
              <Text style={styles.statusCheck}>
                ✓
              </Text>
            </View>

            <View>
              <Text style={styles.statusLabel}>
                ATTENDANCE STATUS
              </Text>

              <Text style={styles.statusTitle}>
                Ready for check-in
              </Text>
            </View>
          </View>

          <View style={styles.readyBadge}>
            <View style={styles.readyDot} />

            <Text style={styles.readyText}>
              READY
            </Text>
          </View>
        </View>

        {/* ======================================
            PRIMARY SCAN ACTION
        ====================================== */}

        <TouchableOpacity
          style={styles.scanCard}
          onPress={() => router.push('/scan')}
          activeOpacity={0.9}
        >
          {/* Background decoration */}

          <View style={styles.scanDecorationOne} />
          <View style={styles.scanDecorationTwo} />

          <View style={styles.scanCardContent}>
            <View style={styles.scanTop}>
              <View style={styles.scanIconBox}>
                <Text style={styles.scanIcon}>
                  ◫
                </Text>
              </View>

              <View style={styles.scanBadge}>
                <Text style={styles.scanBadgeText}>
                  QUICK CHECK-IN
                </Text>
              </View>
            </View>

            <Text style={styles.scanTitle}>
              Scan Event QR
            </Text>

            <Text style={styles.scanDescription}>
              Scan your teacher's QR code to
              record your attendance instantly.
            </Text>

            <View style={styles.scanButton}>
              <Text style={styles.scanButtonText}>
                Start Scanning
              </Text>

              <Text style={styles.scanButtonArrow}>
                →
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Quick Access
            </Text>

            <Text style={styles.sectionSubtitle}>
              Manage your attendance account
            </Text>
          </View>

          <View style={styles.sectionAccent} />
        </View>

        <View style={styles.actionGrid}>
          {/* HISTORY */}

          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.historyCard,
            ]}
            onPress={() =>
              router.push('/history')
            }
            activeOpacity={0.85}
          >
            <View style={styles.actionIconBlue}>
              <Text style={styles.actionEmoji}>
                ◷
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              History
            </Text>

            <Text style={styles.actionDescription}>
              View your attendance records
            </Text>

            <View style={styles.actionArrow}>
              <Text style={styles.actionArrowText}>
                →
              </Text>
            </View>
          </TouchableOpacity>

          {/* PROFILE */}

          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.profileCard,
            ]}
            onPress={() =>
              router.push('/profile')
            }
            activeOpacity={0.85}
          >
            <View style={styles.actionIconPurple}>
              <Text style={styles.actionEmoji}>
                ◎
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              My Profile
            </Text>

            <Text style={styles.actionDescription}>
              Manage your account details
            </Text>

            <View style={styles.actionArrow}>
              <Text style={styles.actionArrowText}>
                →
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ======================================
            HOW IT WORKS
        ====================================== */}

        <View style={styles.guideCard}>
          {/* HEADER */}

          <View style={styles.guideHeader}>
            <View style={styles.guideIcon}>
              <Text style={styles.guideIconText}>
                ?
              </Text>
            </View>

            <View style={styles.guideHeaderText}>
              <Text style={styles.guideTitle}>
                How check-in works
              </Text>

              <Text style={styles.guideSubtitle}>
                Complete your attendance in 3 steps
              </Text>
            </View>
          </View>

          {/* STEP 1 */}

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineNumber}>
                <Text style={styles.timelineNumberText}>
                  1
                </Text>
              </View>

              <View style={styles.timelineLine} />
            </View>

            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>
                Attend your event
              </Text>

              <Text style={styles.timelineText}>
                Go to your scheduled school
                activity or event.
              </Text>
            </View>
          </View>

          {/* STEP 2 */}

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineNumber}>
                <Text style={styles.timelineNumberText}>
                  2
                </Text>
              </View>

              <View style={styles.timelineLine} />
            </View>

            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>
                Scan the QR code
              </Text>

              <Text style={styles.timelineText}>
                Open the scanner and point your
                camera at the teacher's QR code.
              </Text>
            </View>
          </View>

          {/* STEP 3 */}

          <View style={styles.timelineItemLast}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineNumber}>
                <Text style={styles.timelineNumberText}>
                  3
                </Text>
              </View>
            </View>

            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>
                You're checked in
              </Text>

              <Text style={styles.timelineText}>
                Your attendance is recorded
                automatically.
              </Text>
            </View>
          </View>
        </View>

        {/* ======================================
            SECURITY MESSAGE
        ====================================== */}

        <View style={styles.securityCard}>
          <View style={styles.securityIcon}>
            <Text style={styles.securityIconText}>
              ✓
            </Text>
          </View>

          <View style={styles.securityTextContainer}>
            <Text style={styles.securityTitle}>
              Attendance protected
            </Text>

            <Text style={styles.securityText}>
              Your check-in is securely recorded
              in the attendance system.
            </Text>
          </View>

          <Text style={styles.securityArrow}>
            →
          </Text>
        </View>

        {/* ======================================
            FOOTER
        ====================================== */}

        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Text style={styles.footerLogoText}>
              QR
            </Text>
          </View>

          <Text style={styles.footerTitle}>
            QR Attendance
          </Text>

          <Text style={styles.footerSubtitle}>
            School Event Attendance System
          </Text>

          <View style={styles.footerLine} />

          <Text style={styles.footerCopyright}>
            Simple • Fast • Secure
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fc',
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8fc',
  },

  loadingLogo: {
    width: 72,
    height: 72,
    borderRadius: 23,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  loadingLogoText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },

  loadingDots: {
    marginBottom: 10,
  },

  loadingTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },

  loadingText: {
    marginTop: 5,
    color: '#94a3b8',
    fontSize: 12,
  },

  // ==========================================
  // HERO
  // ==========================================

  hero: {
    height: 350,
    backgroundColor: '#1d4ed8',
    overflow: 'hidden',
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
  },

  heroContent: {
    flex: 1,
    paddingTop: 57,
    paddingHorizontal: 22,
  },

  heroGlowOne: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.055)',
    right: -90,
    top: -95,
  },

  heroGlowTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(96,165,250,0.13)',
    left: -100,
    bottom: -80,
  },

  heroCircle: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    right: 45,
    bottom: 25,
  },

  // ==========================================
  // TOP BAR
  // ==========================================

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#86efac',
    marginRight: 7,
  },

  welcomeText: {
    color: '#bfdbfe',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  studentName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    maxWidth: 275,
  },

  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  profileEmoji: {
    fontSize: 22,
  },

  // ==========================================
  // HERO MESSAGE
  // ==========================================

  heroMessage: {
    marginTop: 28,
    maxWidth: 285,
  },

  heroSmallTitle: {
    color: '#93c5fd',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  heroTitle: {
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },

  heroSubtitle: {
    color: '#dbeafe',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 270,
  },

  // ==========================================
  // FLOATING QR
  // ==========================================

  floatingQR: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 92,
    height: 92,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        rotate: '7deg',
      },
    ],
  },

  qrOuter: {
    width: 59,
    height: 59,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qrInner: {
    width: 45,
    height: 45,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  qrText: {
    color: '#1d4ed8',
    fontSize: 13,
    fontWeight: '900',
  },

  qrScanLine: {
    position: 'absolute',
    width: 54,
    height: 2,
    backgroundColor: '#60a5fa',
    top: 45,
  },

  // ==========================================
  // CONTENT
  // ==========================================

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  // ==========================================
  // STATUS CARD
  // ==========================================

  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,

    elevation: 3,
    shadowColor: '#0f172a',
    shadowOpacity: 0.055,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  statusIcon: {
    width: 47,
    height: 47,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  statusCheck: {
    color: '#16a34a',
    fontSize: 24,
    fontWeight: '900',
  },

  statusLabel: {
    color: '#94a3b8',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  statusTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 3,
  },

  readyBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 5,
  },

  readyText: {
    color: '#16a34a',
    fontSize: 9,
    fontWeight: '900',
  },

  // ==========================================
  // SCAN CARD
  // ==========================================

  scanCard: {
    backgroundColor: '#2563eb',
    borderRadius: 25,
    minHeight: 225,
    overflow: 'hidden',
    marginBottom: 28,

    elevation: 6,
    shadowColor: '#2563eb',
    shadowOpacity: 0.23,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
  },

  scanDecorationOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.055)',
    right: -65,
    top: -65,
  },

  scanDecorationTwo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    right: 35,
    bottom: -40,
  },

  scanCardContent: {
    padding: 19,
    flex: 1,
  },

  scanTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scanIconBox: {
    width: 53,
    height: 53,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanIcon: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '300',
  },

  scanBadge: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
  },

  scanBadgeText: {
    color: '#dbeafe',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  scanTitle: {
    color: '#ffffff',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 16,
  },

  scanDescription: {
    color: '#dbeafe',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    maxWidth: 285,
  },

  scanButton: {
    alignSelf: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },

  scanButtonText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '900',
  },

  scanButtonArrow: {
    color: '#1d4ed8',
    fontSize: 17,
    fontWeight: '900',
    marginLeft: 9,
  },

  // ==========================================
  // SECTION HEADER
  // ==========================================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  sectionTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 3,
  },

  sectionAccent: {
    width: 30,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#2563eb',
  },

  // ==========================================
  // ACTION GRID
  // ==========================================

  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 27,
  },

  actionCard: {
    flex: 1,
    minHeight: 170,
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',

    elevation: 2,
    shadowColor: '#0f172a',
    shadowOpacity: 0.045,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  historyCard: {
    backgroundColor: '#ffffff',
  },

  profileCard: {
    backgroundColor: '#ffffff',
  },

  actionIconBlue: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  actionIconPurple: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  actionEmoji: {
    color: '#2563eb',
    fontSize: 25,
    fontWeight: '700',
  },

  actionTitle: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '900',
  },

  actionDescription: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
    maxWidth: 125,
  },

  actionArrow: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    width: 31,
    height: 31,
    borderRadius: 11,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionArrowText: {
    color: '#2563eb',
    fontSize: 17,
    fontWeight: '900',
  },

  // ==========================================
  // GUIDE CARD
  // ==========================================

  guideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 19,
    marginBottom: 15,

    elevation: 2,
    shadowColor: '#0f172a',
    shadowOpacity: 0.045,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  guideIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  guideIconText: {
    color: '#2563eb',
    fontSize: 20,
    fontWeight: '900',
  },

  guideHeaderText: {
    flex: 1,
  },

  guideTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '900',
  },

  guideSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 3,
  },

  // ==========================================
  // TIMELINE
  // ==========================================

  timelineItem: {
    flexDirection: 'row',
    minHeight: 76,
  },

  timelineItemLast: {
    flexDirection: 'row',
  },

  timelineLeft: {
    width: 31,
    alignItems: 'center',
  },

  timelineNumber: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  timelineNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },

  timelineLine: {
    position: 'absolute',
    top: 29,
    bottom: 0,
    width: 2,
    backgroundColor: '#dbeafe',
  },

  timelineContent: {
    flex: 1,
    marginLeft: 13,
    paddingBottom: 17,
  },

  timelineTitle: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '900',
  },

  timelineText: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  // ==========================================
  // SECURITY CARD
  // ==========================================

  securityCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },

  securityIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  securityIconText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },

  securityTextContainer: {
    flex: 1,
  },

  securityTitle: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '900',
  },

  securityText: {
    color: '#4d7c5b',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },

  securityArrow: {
    color: '#16a34a',
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 8,
  },

  // ==========================================
  // FOOTER
  // ==========================================

  footer: {
    alignItems: 'center',
    paddingTop: 7,
    paddingBottom: 10,
  },

  footerLogo: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerLogoText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },

  footerTitle: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8,
  },

  footerSubtitle: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 3,
  },

  footerLine: {
    width: 45,
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },

  footerCopyright: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});