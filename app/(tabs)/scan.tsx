import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import { parseQRPayload } from '@/lib/qr';
import { registerAttendance } from '@/lib/attendance';

export default function ScanScreen() {
  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] =
    useState<'success' | 'error' | ''>('');

  // ============================================
  // RESET WHEN SCREEN OPENS
  // ============================================

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setProcessing(false);
      setMessage('');
      setMessageType('');
    }, [])
  );

  // ============================================
  // QR SCANNER
  // ============================================

  async function handleBarcodeScanned({
    data,
  }: {
    data: string;
  }) {
    if (scanned || processing) {
      return;
    }

    setScanned(true);
    setProcessing(true);
    setMessage('');
    setMessageType('');

    const payload = parseQRPayload(data);

    if (!payload) {
      setMessage('This QR code is not valid.');
      setMessageType('error');
      setProcessing(false);
      return;
    }

    const { error } =
      await registerAttendance(payload.event);

    setProcessing(false);

    if (error) {
      setMessage(error.message);
      setMessageType('error');
      return;
    }

    setMessage(
      'Attendance recorded successfully!'
    );

    setMessageType('success');
  }

  // ============================================
  // CAMERA PERMISSION
  // ============================================

  async function requestCamera() {
    await requestPermission();
  }

  // ============================================
  // CHECKING PERMISSION
  // ============================================

  if (!permission) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionEmoji}>
            📷
          </Text>
        </View>

        <Text style={styles.permissionTitle}>
          Preparing Scanner
        </Text>

        <Text style={styles.permissionText}>
          Checking camera permission...
        </Text>

        <ActivityIndicator
          size="small"
          color="#2563eb"
        />
      </View>
    );
  }

  // ============================================
  // CAMERA PERMISSION REQUIRED
  // ============================================

  if (!permission.granted) {
    return (
      <View style={styles.permissionScreen}>
        <View style={styles.permissionIcon}>
          <Text style={styles.permissionEmoji}>
            📷
          </Text>
        </View>

        <Text style={styles.permissionTitle}>
          Camera Access Needed
        </Text>

        <Text style={styles.permissionText}>
          QR Attendance needs access to your
          camera to scan event QR codes and
          record your attendance.
        </Text>

        <TouchableOpacity
          style={styles.allowButton}
          onPress={requestCamera}
          activeOpacity={0.85}
        >
          <Text style={styles.allowButtonText}>
            Allow Camera
          </Text>

          <Text style={styles.allowArrow}>
            →
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ============================================
  // SCANNER
  // ============================================

  return (
    <View style={styles.container}>
      {/* CAMERA */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={
          scanned
            ? undefined
            : handleBarcodeScanned
        }
      />

      {/* DARK OVERLAY */}
      <View style={styles.darkOverlay} />

      {/* ========================================
          TOP HEADER
      ======================================== */}

      <View style={styles.topHeader}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>
            QR
          </Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            QR Attendance
          </Text>

          <Text style={styles.headerSubtitle}>
            Event Check-in
          </Text>
        </View>
      </View>

      {/* ========================================
          SCANNER CONTENT
      ======================================== */}

      <View style={styles.scannerContent}>
        <Text style={styles.title}>
          Scan Event QR
        </Text>

        <Text style={styles.subtitle}>
          Position the QR code inside the frame
        </Text>

        {/* SCANNER FRAME */}
        <View style={styles.scannerWrapper}>
          <View style={styles.scannerBox}>

            {/* TOP LEFT */}
            <View
              style={[
                styles.corner,
                styles.topLeft,
              ]}
            />

            {/* TOP RIGHT */}
            <View
              style={[
                styles.corner,
                styles.topRight,
              ]}
            />

            {/* BOTTOM LEFT */}
            <View
              style={[
                styles.corner,
                styles.bottomLeft,
              ]}
            />

            {/* BOTTOM RIGHT */}
            <View
              style={[
                styles.corner,
                styles.bottomRight,
              ]}
            />

            {/* CENTER SCAN LINE */}
            {!scanned && !processing && (
              <View style={styles.scanLine} />
            )}

            {/* CENTER ICON */}
            {processing && (
              <View style={styles.processingCircle}>
                <ActivityIndicator
                  size="large"
                  color="#ffffff"
                />
              </View>
            )}

            {messageType === 'success' && (
              <View style={styles.successCircle}>
                <Text style={styles.successIcon}>
                  ✓
                </Text>
              </View>
            )}

            {messageType === 'error' && (
              <View style={styles.errorCircle}>
                <Text style={styles.errorIcon}>
                  !
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ======================================
            STATUS
        ====================================== */}

        {processing && (
          <View style={styles.statusCard}>
            <ActivityIndicator
              size="small"
              color="#2563eb"
            />

            <Text style={styles.statusText}>
              Checking attendance...
            </Text>
          </View>
        )}

        {message && !processing && (
          <View
            style={[
              styles.statusCard,
              messageType === 'success'
                ? styles.successCard
                : styles.errorCard,
            ]}
          >
            <View
              style={[
                styles.statusIcon,
                messageType === 'success'
                  ? styles.successStatusIcon
                  : styles.errorStatusIcon,
              ]}
            >
              <Text style={styles.statusIconText}>
                {messageType === 'success'
                  ? '✓'
                  : '!'}
              </Text>
            </View>

            <Text style={styles.statusMessage}>
              {message}
            </Text>
          </View>
        )}

        {/* ======================================
            SCAN AGAIN
        ====================================== */}

        {scanned && !processing && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => {
              setScanned(false);
              setMessage('');
              setMessageType('');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.scanAgainIcon}>
              ↻
            </Text>

            <Text style={styles.scanAgainText}>
              Scan Again
            </Text>
          </TouchableOpacity>
        )}

        {/* ======================================
            INSTRUCTION
        ====================================== */}

        {!message && !processing && (
          <View style={styles.instructionCard}>
            <View style={styles.instructionIcon}>
              <Text>💡</Text>
            </View>

            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>
                Scanning Tips
              </Text>

              <Text style={styles.instructionText}>
                Keep the QR code inside the frame
                and make sure it is clearly visible.
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* ========================================
          BOTTOM
      ======================================== */}

      <View style={styles.bottomInfo}>
        <View style={styles.securityDot} />

        <Text style={styles.bottomText}>
          Secure Attendance Check-in
        </Text>
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // ==========================================
  // PERMISSION SCREEN
  // ==========================================

  permissionScreen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
  },

  permissionIcon: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },

  permissionEmoji: {
    fontSize: 42,
  },

  permissionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
  },

  permissionText: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },

  allowButton: {
    backgroundColor: '#2563eb',
    borderRadius: 15,
    paddingHorizontal: 22,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 190,

    elevation: 4,

    shadowColor: '#2563eb',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  allowButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },

  allowArrow: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 12,
  },

  // ==========================================
  // CAMERA OVERLAY
  // ==========================================

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  // ==========================================
  // HEADER
  // ==========================================

  topHeader: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },

  headerText: {
    marginLeft: 12,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#d1d5db',
    fontSize: 11,
    marginTop: 2,
  },

  // ==========================================
  // SCANNER CONTENT
  // ==========================================

  scannerContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 145,
  },

  title: {
    color: '#ffffff',
    fontSize: 27,
    fontWeight: '900',
  },

  subtitle: {
    color: '#d1d5db',
    fontSize: 13,
    marginTop: 7,
    marginBottom: 30,
  },

  // ==========================================
  // SCANNER
  // ==========================================

  scannerWrapper: {
    width: 290,
    height: 290,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scannerBox: {
    width: 270,
    height: 270,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  corner: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderColor: '#ffffff',
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },

  scanLine: {
    position: 'absolute',
    left: 15,
    right: 15,
    height: 3,
    backgroundColor: '#60a5fa',
    top: '50%',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },

  processingCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(37,99,235,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successIcon: {
    color: '#ffffff',
    fontSize: 43,
    fontWeight: '900',
  },

  errorCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorIcon: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
  },

  // ==========================================
  // STATUS CARD
  // ==========================================

  statusCard: {
    marginTop: 22,
    minHeight: 55,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '88%',
  },

  successCard: {
    backgroundColor: '#f0fdf4',
  },

  errorCard: {
    backgroundColor: '#fef2f2',
  },

  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  successStatusIcon: {
    backgroundColor: '#16a34a',
  },

  errorStatusIcon: {
    backgroundColor: '#dc2626',
  },

  statusIconText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },

  statusText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },

  statusMessage: {
    flex: 1,
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },

  // ==========================================
  // SCAN AGAIN
  // ==========================================

  scanAgainButton: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  scanAgainIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginRight: 8,
  },

  scanAgainText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },

  // ==========================================
  // INSTRUCTION
  // ==========================================

  instructionCard: {
    marginTop: 20,
    width: '88%',
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(15,23,42,0.85)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  instructionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  instructionContent: {
    flex: 1,
  },

  instructionTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },

  instructionText: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
  },

  // ==========================================
  // BOTTOM
  // ==========================================

  bottomInfo: {
    position: 'absolute',
    bottom: 25,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  securityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 7,
  },

  bottomText: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '600',
  },
});