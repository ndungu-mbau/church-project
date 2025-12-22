
import { View, Text } from 'react-native';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export default function AccordionDemo() {
  return (
    <View className="flex-1 p-8 bg-background pt-24">
      <Text className="text-2xl font-bold mb-4 text-foreground">Accordion Demo</Text>
      <Accordion type="multiple" collapsible defaultValue={['item-1']} className="w-full max-w-sm">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Text className="text-foreground font-medium">Is it accessible?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-foreground">Yes. It adheres to the WAI-ARIA design pattern.</Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <Text className="text-foreground font-medium">Is it styled?</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text className="text-foreground">Yes. It comes with default styles that match the other components' aesthetic.</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Text className="text-xl font-bold mt-8 mb-4 text-foreground">Surface Variant</Text>
      <Accordion type="multiple" collapsible defaultValue={['item-surface-1']} className="w-full max-w-sm">
        <AccordionItem value="item-surface-1" variant="surface">
          <AccordionTrigger variant="surface">
            <Text className="text-foreground font-medium">Surface Accordion?</Text>
          </AccordionTrigger>
          <AccordionContent variant="surface">
            <Text className="text-foreground">Yes, this matches my custom surface style.</Text>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-surface-2" variant="surface">
          <AccordionTrigger variant="surface">
            <Text className="text-foreground font-medium">Another item?</Text>
          </AccordionTrigger>
          <AccordionContent variant="surface">
            <Text className="text-foreground">It has rounded corners and border.</Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </View>
  );
}
