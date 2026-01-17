import * as React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { Progress } from "@/components/ui/progress"

export default function ProgressDemo() {
  const [progress, setProgress] = React.useState(13)

  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Progress Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          Displays an indicator showing the completion progress of a task.
        </Text>
      </View>
      <Progress value={progress} className="w-[60%]" indicatorClassName="bg-primary" />

      <View className="flex-row gap-4 mt-4">
        <TouchableOpacity
          className="px-4 py-2 bg-secondary rounded-md"
          onPress={() => setProgress(Math.max(0, progress - 10))}
        >
          <Text className="text-secondary-foreground">-10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-secondary rounded-md"
          onPress={() => setProgress(Math.min(100, progress + 10))}
        >
          <Text className="text-secondary-foreground">+10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-primary rounded-md"
          onPress={() => setProgress(Math.floor(Math.random() * 101))}
        >
          <Text className="text-primary-foreground">Random</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-foreground">Current Value: {progress}%</Text>
    </View>
  )
}
