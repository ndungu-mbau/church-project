import { View, Text } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarDemo() {
  return (
    <View className="flex-1 p-8 bg-background gap-8 flex-col items-center pt-24">
      <View>
        <Text className="text-2xl font-bold mb-4 text-foreground text-center">Avatar Demo</Text>
        <Text className="text-muted-foreground text-center mb-8">
          An image element with a fallback for representing the user.
        </Text>
      </View>

      <View className="flex-row gap-8 items-center flex-wrap justify-center">
        {/* Standard Avatar */}
        <View className="items-center gap-2">
            <Avatar className='h-12 w-12' alt="Avatar of Shadcn">
                <AvatarImage 
                    source={{ uri: 'https://github.com/shadcn.png' }} 
                />
                <AvatarFallback>
                    <Text className='text-muted-foreground'>CN</Text>
                </AvatarFallback>
            </Avatar>
            <Text className="text-sm text-muted-foreground">Standard</Text>
        </View>

        {/* Square Avatar */}
        <View className="items-center gap-2">
            <Avatar className='h-12 w-12' variant="square" alt="Square Avatar">
                <AvatarImage 
                    source={{ uri: 'https://github.com/shadcn.png' }} 
                />
                <AvatarFallback>
                    <Text className='text-muted-foreground'>CN</Text>
                </AvatarFallback>
            </Avatar>
            <Text className="text-sm text-muted-foreground">Square</Text>
        </View>

        {/* Fallback Avatar */}
        <View className="items-center gap-2">
            <Avatar className='h-12 w-12' alt="Fallback Avatar">
                <AvatarImage 
                    source={{ uri: 'https://broken-image.com/broken.png' }} 
                />
                <AvatarFallback>
                    <Text className="text-foreground font-medium">JD</Text>
                </AvatarFallback>
            </Avatar>
            <Text className="text-sm text-muted-foreground">Fallback</Text>
        </View>

         {/* Large Avatar */}
         <View className="items-center gap-2">
            <Avatar className='h-20 w-20' alt="Large Avatar">
                <AvatarImage 
                    source={{ uri: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80' }} 
                />
                <AvatarFallback>
                    <Text className='text-3xl font-bold text-foreground'>L</Text>
                </AvatarFallback>
            </Avatar>
            <Text className="text-sm text-muted-foreground">Large</Text>
        </View>
      </View>
    </View>
  );
}
