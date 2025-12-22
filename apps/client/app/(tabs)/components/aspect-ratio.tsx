import { View, Text, Image } from 'react-native';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export default function AspectRatioDemo() {
  return (
      <View className="flex-1 p-8 bg-background gap-8">
        <View>
          <Text className="text-2xl font-bold mb-4 text-foreground text-center">Aspect Ratio Demo</Text>
          <Text className="text-muted-foreground text-center mb-8">
            Displays content within a desired ratio.
          </Text>
        </View>

        <View className="gap-6">
            <View>
                <Text className="text-lg font-medium text-foreground mb-2">16:9 Ratio</Text>
                <View className="w-full overflow-hidden rounded-xl border border-border shadow-sm">
                    <AspectRatio ratio={16 / 9}>
                        <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&dpr=2&q=80' }}
                        className="w-full h-full object-cover"
                        alt="Photo by Alvaro Pinot"
                        />
                    </AspectRatio>
                </View>
            </View>

            <View>
                <Text className="text-lg font-medium text-foreground mb-2">4:3 Ratio</Text>
                <View className="w-1/2 overflow-hidden rounded-xl border border-border shadow-sm bg-muted">
                    <AspectRatio ratio={4 / 3}>
                         <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80' }}
                        className="w-full h-full object-cover"
                        alt="Photo by Drew Beamer"
                        />
                    </AspectRatio>
                </View>
            </View>
        </View>
    </View>
  );
}
