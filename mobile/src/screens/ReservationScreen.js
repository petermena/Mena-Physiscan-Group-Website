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
import { colors, spacing, radius, fonts } from '../theme';
import { findRestaurant } from '../services/api';

const BUDGETS = ['Budget-Friendly', 'Moderate', 'Upscale', 'Fine Dining'];
const OCCASIONS = ['Date Night', 'Business Dinner', 'Birthday', 'Anniversary', 'Family', 'Casual'];
const PARTY_SIZES = ['1', '2', '3', '4', '5', '6', '8', '10+'];

export default function ReservationScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [occasion, setOccasion] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [budget, setBudget] = useState('Moderate');
  const [preferences, setPreferences] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setResult('');
    try {
      const data = await findRestaurant({
        cuisine,
        location,
        occasion: occasion.toLowerCase(),
        partySize,
        budget: budget.toLowerCase(),
        preferences,
      });
      setResult(data.suggestions);
    } catch {
      setResult('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Find the Perfect Restaurant</Text>
      <Text style={styles.subtitle}>
        Tell Aria your preferences and get personalized recommendations.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Cuisine Type</Text>
        <TextInput
          style={styles.input}
          value={cuisine}
          onChangeText={setCuisine}
          placeholder="e.g. Italian, Japanese, Steakhouse"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Location / Area</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Downtown Miami, Manhattan"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Occasion</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {OCCASIONS.map(o => (
              <TouchableOpacity
                key={o}
                style={[styles.chip, occasion === o && styles.chipActive]}
                onPress={() => setOccasion(occasion === o ? '' : o)}
              >
                <Text style={[styles.chipText, occasion === o && styles.chipTextActive]}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Party Size</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {PARTY_SIZES.map(s => (
              <TouchableOpacity
                key={s}
                style={[styles.chipSmall, partySize === s && styles.chipActive]}
                onPress={() => setPartySize(s)}
              >
                <Text style={[styles.chipText, partySize === s && styles.chipTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Budget</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipRow}>
            {BUDGETS.map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.chip, budget === b && styles.chipActive]}
                onPress={() => setBudget(b)}
              >
                <Text style={[styles.chipText, budget === b && styles.chipTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Other Preferences (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={preferences}
          onChangeText={setPreferences}
          placeholder="e.g. outdoor seating, quiet atmosphere, great wine list..."
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.actionButton, loading && styles.actionButtonDisabled]}
        onPress={handleSearch}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.actionButtonText}>Find Restaurants</Text>
        )}
      </TouchableOpacity>

      {result ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Recommendations</Text>
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
  heading: {
    ...fonts.heading,
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xxl,
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
    height: 80,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgTertiary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSmall: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgTertiary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
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
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultTitle: {
    ...fonts.subheading,
    fontSize: 15,
  },
  resultText: {
    padding: spacing.lg,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textPrimary,
  },
});
