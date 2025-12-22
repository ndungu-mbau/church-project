import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Chip } from '@/components/ui/chip';
import { Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react-native';

export default function ChipDemo() {
  const [removableChips, setRemovableChips] = React.useState([
    { id: 1, label: 'React Native', color: 'primary' },
    { id: 2, label: 'Expo', color: 'secondary' },
    { id: 3, label: 'Tailwind', color: 'success' },
    { id: 4, label: 'Unistyles', color: 'danger' },
  ]);

  const removeChip = (id: number) => {
    setRemovableChips(prev => prev.filter(chip => chip.id !== id));
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
      <View className="gap-8 pb-12">
        <Text className="text-3xl font-bold text-foreground">Chip Demo</Text>

        {/* Colors */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Colors (Solid)</Text>
          <View className="flex-row flex-wrap gap-2">
            <Chip label="Default" color="default" />
            <Chip label="Primary" color="primary" />
            <Chip label="Secondary" color="secondary" />
            <Chip label="Success" color="success" />
            <Chip label="Danger" color="danger" />
          </View>
        </View>

        {/* Variants */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Variants (Primary)</Text>
          <View className="flex-row flex-wrap gap-2">
            <Chip label="Solid" variant="solid" color="primary" />
            <Chip label="Bordered" variant="bordered" color="primary" />
            <Chip label="Light" variant="light" color="primary" />
            <Chip label="Flat" variant="flat" color="primary" />
            <Chip label="Faded" variant="faded" color="primary" />
            <Chip label="Dot" variant="dot" color="primary" />
          </View>
        </View>

        {/* Sizes */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Sizes</Text>
          <View className="flex-row items-center flex-wrap gap-2">
            <Chip label="Small" size="sm" color="primary" />
            <Chip label="Medium" size="md" color="primary" />
            <Chip label="Large" size="lg" color="primary" />
          </View>
        </View>

        {/* Radius */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Radius</Text>
          <View className="flex-row flex-wrap gap-2">
            <Chip label="Full" radius="full" color="secondary" />
            <Chip label="Large" radius="lg" color="secondary" />
            <Chip label="Medium" radius="md" color="secondary" />
            <Chip label="Small" radius="sm" color="secondary" />
            <Chip label="None" radius="none" color="secondary" />
          </View>
        </View>

        {/* With Content */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">With Icons</Text>
          <View className="flex-row flex-wrap gap-2">
            <Chip
              label="Check"
              color="success"
              variant="flat"
              startContent={<CheckCircle2 size={14} color="#22c55e" />}
            />
            <Chip
              label="Alert"
              color="danger"
              variant="faded"
              startContent={<AlertCircle size={14} color="#ef4444" />}
            />
            <Chip
              label="Mail"
              color="primary"
              variant="bordered"
              endContent={<Mail size={14} color="#3b82f6" />}
            />
            <Chip
              label="Premium"
              color="secondary"
              radius="md"
              startContent={<Sparkles size={14} color="#a855f7" />}
            />
          </View>
        </View>

        {/* Removable */}
        <View className="gap-4">
          <Text className="text-xl font-semibold text-foreground">Removable</Text>
          <View className="flex-row flex-wrap gap-2">
            {removableChips.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                color={chip.color as any}
                variant="flat"
                onClose={() => removeChip(chip.id)}
              />
            ))}
            {removableChips.length === 0 && (
              <Text className="text-muted-foreground italic">All chips removed.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
