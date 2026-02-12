import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '../theme';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';

const PRIORITIES = ['high', 'medium', 'low'];
const CATEGORIES = ['general', 'email', 'meeting', 'personal', 'work'];

const priorityColors = {
  high: colors.danger,
  medium: colors.warning,
  low: colors.success,
};

export default function TaskScreen() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks);
    } catch {
      // Server not running
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAdd = async () => {
    if (!title.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await createTask({ title, description, priority, category });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('general');
      setShowForm(false);
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const handleToggle = async (task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await updateTask(task.id, { completed: !task.completed });
      fetchTasks();
    } catch {
      // handle error
    }
  };

  const handleDelete = (task) => {
    Alert.alert('Delete Task', `Delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          try {
            await deleteTask(task.id);
            fetchTasks();
          } catch {
            // handle error
          }
        },
      },
    ]);
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const renderTask = ({ item }) => (
    <View style={[styles.taskItem, item.completed && styles.taskItemCompleted]}>
      <TouchableOpacity
        style={[styles.checkbox, item.completed && styles.checkboxDone]}
        onPress={() => handleToggle(item)}
      >
        {item.completed && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </TouchableOpacity>
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
          {item.title}
        </Text>
        {item.description && !item.completed ? (
          <Text style={styles.taskDesc}>{item.description}</Text>
        ) : null}
        {!item.completed && (
          <View style={styles.taskMeta}>
            <Text style={[styles.taskPriority, { color: priorityColors[item.priority] }]}>
              {item.priority}
            </Text>
            <Text style={styles.taskCategory}>{item.category}</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
        <Ionicons name="close" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const allTasks = [
    ...activeTasks,
    ...(completedTasks.length > 0 ? [{ id: 'divider', isDivider: true }] : []),
    ...completedTasks,
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.stats}>
          <Text style={styles.statText}>{activeTasks.length} active</Text>
          <Text style={styles.statDivider}>/</Text>
          <Text style={styles.statText}>{completedTasks.length} done</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowForm(!showForm);
          }}
        >
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : '+ New Task'}</Text>
        </TouchableOpacity>
      </View>

      {/* Add Form */}
      {showForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            placeholderTextColor={colors.textMuted}
            autoFocus
          />
          <TextInput
            style={styles.descInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Add details (optional)"
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Priority</Text>
            <View style={styles.chipRow}>
              {PRIORITIES.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, priority === p && { backgroundColor: priorityColors[p] + '22', borderColor: priorityColors[p] }]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.chipText, priority === p && { color: priorityColors[p] }]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Category</Text>
            <View style={styles.chipRow}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.chip, category === c && styles.chipActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, !title.trim() && { opacity: 0.5 }]}
            onPress={handleAdd}
            disabled={!title.trim()}
          >
            <Text style={styles.submitButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task List */}
      {allTasks.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="checkbox-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No tasks yet. Add one to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={allTasks}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) =>
            item.isDivider ? (
              <Text style={styles.sectionLabel}>Completed</Text>
            ) : (
              renderTask({ item })
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statDivider: {
    color: colors.textMuted,
  },
  addButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    margin: spacing.xl,
    marginTop: spacing.sm,
    backgroundColor: colors.bgSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  titleInput: {
    backgroundColor: colors.bgPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  descInput: {
    backgroundColor: colors.bgPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 14,
    color: colors.textPrimary,
    minHeight: 50,
  },
  formRow: {
    gap: spacing.sm,
  },
  formLabel: {
    ...fonts.label,
    fontSize: 11,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
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
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.accent,
  },
  submitButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
    gap: spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.bgSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md + 2,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  taskItemCompleted: {
    opacity: 0.5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  taskDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 2,
  },
  taskPriority: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  taskCategory: {
    fontSize: 11,
    color: colors.textMuted,
    textTransform: 'capitalize',
  },
  deleteButton: {
    padding: spacing.xs,
  },
  sectionLabel: {
    ...fonts.label,
    fontSize: 11,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
});
