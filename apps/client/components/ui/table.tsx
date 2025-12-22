import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import * as TablePrimitive from '@rn-primitives/table';
import { cn } from '@/lib/utils';

const Table = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Root>
>(({ className, ...props }, ref) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <TablePrimitive.Root
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </ScrollView>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Header>
>(({ className, ...props }, ref) => (
  <TablePrimitive.Header
    ref={ref}
    className={cn('[&_tr]:border-b border-border', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Body>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Body>
>(({ className, ...props }, ref) => (
  <TablePrimitive.Body
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Footer>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Footer>
>(({ className, ...props }, ref) => (
  <TablePrimitive.Footer
    ref={ref}
    className={cn(
      'border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0',
      className
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Row>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Row>
>(({ className, ...props }, ref) => (
  <TablePrimitive.Row
    ref={ref}
    className={cn(
      'flex-row border-b border-border transition-colors data-[state=selected]:bg-muted',
      className
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Head>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Head>
>(({ className, children, ...props }, ref) => (
  <TablePrimitive.Head
    ref={ref}
    className={cn(
      'h-12 px-4 justify-center flex-1 [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  >
    {typeof children === 'string' ? (
      <Text className='text-muted-foreground font-medium text-sm'>{children}</Text>
    ) : (
      children
    )}
  </TablePrimitive.Head>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  React.ElementRef<typeof TablePrimitive.Cell>,
  React.ComponentPropsWithoutRef<typeof TablePrimitive.Cell>
>(({ className, children, ...props }, ref) => (
  <TablePrimitive.Cell
    ref={ref}
    className={cn('p-4 align-middle flex-1 [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  >
    {typeof children === 'string' ? (
      <Text className='text-foreground text-sm'>{children}</Text>
    ) : (
      children
    )}
  </TablePrimitive.Cell>
));
TableCell.displayName = 'TableCell';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
};
