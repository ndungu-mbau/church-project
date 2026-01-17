---
description: How to implement a new native shadcn/ui component using rn-primitives
---

This workflow guides you through adding a new UI component to `apps/client` using `rn-primitives` and styling it to match shadcn/ui design.

## Component Checklist

**Core Primitives:**

- [x] **Accordion** (Implemented)
- [x] **Alert Dialog** (Implemented)
- [x] **Aspect Ratio** (Implemented)
- [x] **Avatar** (Implemented)
- [x] **Button** (Implemented)
- [x] **Checkbox** (Implemented)
- [x] **Collapsible** (Implemented)
- [x] **Context Menu** (Implemented)
- [x] **Dialog** (Implemented)
- [x] **Dropdown Menu** (Implemented)
- [x] **Input** (Implemented)
- [x] **Hover Card** (Implemented)
- [x] **Label** (Implemented)
- [x] **Menubar** (Implemented)
- [x] **Navigation Menu** (Implemented)
- [x] **Popover** (Implemented)
- [x] **Progress** (Implemented)
- [x] **Radio Group** (Implemented)
- [x] **Select** (Implemented)
- [x] **Separator** (Implemented)
- [x] **Slider** (Implemented)
- [x] **Switch** (Implemented)
- [x] **Card** (Implemented)
- [x] **Chip** (Implemented)
- [x] **File Input** (Implemented)
- [x] **Table** (Implemented)
- [x] **Tabs** (Implemented)
- [x] **Toast** (Implemented)
- [x] **Toggle** (Implemented)
- [x] **Toggle Group** (Implemented)
- [x] **Toolbar** (Implemented)
- [x] **Tooltip** (Implemented)

## Workflow Steps

1.  **Identify the Component**

    - Pick the next unchecked component from the list above.
    - Refer to [rn-primitives documentation](https://rn-primitives.vercel.app) for the specific primitive.

2.  **Install the Primitive**

    - Run the installation command in the `apps/client` directory.
    - Command pattern: `npx expo install @rn-primitives/[component-name]`
    - _Note: Check the docs if shared primitives (Types, Hooks, Slot) are also needed._

3.  **Create the Component File**

    - Create a new file in `apps/client/components/ui/[component-name].tsx`.
    - If the component has multiple parts (e.g. Item, Trigger, Content), define them all in this file or a folder `apps/client/components/ui/[component-name]/index.tsx`.

4.  **Implement the Component**

    - **Imports**:
      ```typescript
      import * as React from "react";
      import { Text, View } from "react-native";
      import * as ComponentPrimitive from "@rn-primitives/[component-name]";
      import { cn } from "@/lib/utils"; // Assuming a utility for class merging exists
      ```
    - **Structure**:

      - Wrap the primitive components using `React.forwardRef`.
      - Apply `className` props for styling (using `nativewind` / `uniwind`).
      - Pass through `ref` and other props to the primitive.

    - **Example Template (Generic)**:

      ```typescript
      const ComponentRoot = React.forwardRef<
        React.ElementRef<typeof ComponentPrimitive.Root>,
        React.ComponentPropsWithoutRef<typeof ComponentPrimitive.Root>
      >(({ className, ...props }, ref) => (
        <ComponentPrimitive.Root
          ref={ref}
          className={cn("base-styles-here", className)}
          {...props}
        />
      ));
      ComponentRoot.displayName = ComponentPrimitive.Root.displayName;

      export { ComponentRoot };
      ```

5.  **Styling (Shadcn/UI Design)**

    - **Reference**: Check the source code of the component in [heroui-native](https://github.com/heroui-inc/heroui-native) to understand its styling and variants (e.g., `solid`, `faded`, `bordered`, `light`, `flat`, `shadow` for buttons).
    - **Implementation**: Adapt these styles into the `cva` definition in your component.
    - **Variants**: Use `class-variance-authority` (cva) to handle the identified variants.
    - **Theming**: Use standard shadcn/ui CSS variables (e.g., `bg-background`, `text-primary`, `border-border`) which are defined in `apps/client/global.css`.
    - Example with CVA:

      ```typescript
      import { cva, type VariantProps } from "class-variance-authority";

      const variants = cva("base-styles", {
        variants: { variant: { default: "...", raised: "..." } },
        defaultVariants: { variant: "default" },
      });

      // Use in component: className={cn(variants({ variant }), className)}
      ```

6.  **Export**

    - Ensure all necessary parts (Root, Trigger, Content, etc.) are exported.

7.  **Test**
    - Create a demo screen in `apps/client/app/(drawer)/[component-name].tsx`.
    - Add the screen configuration to `apps/client/app/(drawer)/_layout.tsx`:
      ```typescript
      <Drawer.Screen
        name="[component-name]" // matches filename without extension
        options={{
          headerTitle: "[Component] Demo",
          drawerLabel: "...",
          drawerIcon: ({ size, color }) => (
            <Ionicons name="square-outline" size={size} color={color} />
          ),
        }}
      />
      ```
    - Verify the component renders and interacts correctly in the app.
