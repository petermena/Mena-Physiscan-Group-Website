import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius, fonts } from '../theme';
import { draftEmail, replyToEmail } from '../services/api';

const TONES = ['Professional', 'Friendly', 'Formal', 'Casual', 'Apologetic', 'Persuasive'];
const REPLY_TONES = ['Match Original', 'Professional', 'Friendly', 'Formal', 'Casual'];

export default function EmailScreen() {
  const [mode, setMode] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Draft fields
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('Professional');

  // Reply fields
  const [originalEmail, setOriginalEmail] = useState('');
  const [instructions, setInstructions] = useState('');
  const [replyTone, setReplyTone] = useState('Match Original');

  const handleDraft = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const data = await draftEmail({
        context,
        tone: tone.toLowerCase(),
        recipientName,
        subject,
      });
      setResult(data.draft);
    } catch {
      setResult('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!originalEmail.trim() || !instructions.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const data = await replyToEmail({
        originalEmail,
        instructions,
        tone: replyTone.toLowerCase(),
      });
      setResult(data.reply);
    } catch {
      setResult('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(result);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Mode Toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'draft' && styles.modeButtonActive]}
          onPress={() => { setMode('draft'); setResult(''); }}
        >
          <Text style={[styles.modeButtonText, mode === 'draft' && styles.modeButtonTextActive]}>
            Draft New
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'reply' && styles.modeButtonActive]}
          onPress={() => { setMode('reply'); setResult(''); }}
        >
          <Text style={[styles.modeButtonText, mode === 'reply' && styles.modeButtonTextActive]}>
            Reply to Email
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'draft' ? (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Recipient Name</Text>
            <TextInput
              style={styles.input}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="e.g. John Smith"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Subject (optional)</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Aria will suggest one if left blank"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Tone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {TONES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, tone === t && styles.chipActive]}
                  onPress={() => setTone(t)}
                >
                  <Text style={[styles.chipText, tone === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>What should the email say?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={context}
              onChangeText={setContext}
              placeholder="Describe what you want to communicate..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
          <TouchableOpacity
            style={[styles.actionButton, (!context.trim() || loading) && styles.actionButtonDisabled]}
            onPress={handleDraft}
            disabled={!context.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.actionButtonText}>Draft Email</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Paste the email you received</Text>
            <TextInput
              style={[styles.input, styles.textAreaLarge]}
              value={originalEmail}
              onChangeText={setOriginalEmail}
              placeholder="Paste the full email content here..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>How should I reply?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="e.g. Politely decline but suggest rescheduling..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Reply Tone</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
              {REPLY_TONES.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.chip, replyTone === t && styles.chipActive]}
                  onPress={() => setReplyTone(t)}
                >
                  <Text style={[styles.chipText, replyTone === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, (!originalEmail.trim() || !instructions.trim() || loading) && styles.actionButtonDisabled]}
            onPress={handleReply}
            disabled={!originalEmail.trim() || !instructions.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.actionButtonText}>Generate Reply</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {result ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Aria's Draft</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 60,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.sm,
    padding: 4,
    marginBottom: spacing.xl,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: colors.bgTertiary,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.textPrimary,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    ...fonts.label,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 150,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgTertiary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.accentSubtle,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accent,
  },
  actionButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xxl,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultTitle: {
    ...fonts.subheading,
    fontSize: 15,
  },
  copyButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.bgTertiary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  resultText: {
    padding: spacing.lg,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textPrimary,
  },
});
