import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useCallback } from "react";
import { Pressable, Text } from "react-native";
import { ThemeToggle } from "@/components/theme-toggle";

import { View } from "react-native";

function CustomDrawerContent(props: any) {
	return (
		<View style={{ flex: 1 }}>
			<View className="p-6 pt-12 border-b border-border/50 bg-background/50">
				<View className="flex-row items-center gap-3">
					<View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
						<Ionicons name="apps" size={24} color="white" />
					</View>
					<View>
						<Text className="text-xl font-bold text-foreground">
							Imani Manager
						</Text>
						<Text className="text-xs text-muted-foreground font-medium">
							Church Management
						</Text>
					</View>
				</View>
			</View>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ paddingTop: 0 }}
			>
				<View className="px-2 py-4">
					<DrawerItemList {...props} />
				</View>
			</DrawerContentScrollView>
			<View className="p-6 border-t border-border/50 bg-background/50">
				<Text className="text-[10px] text-muted-foreground/50 text-center font-medium">
					VERSION 4.0.0
				</Text>
			</View>
		</View>
	);
}

function DrawerLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

	return (
		<Drawer
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerTintColor: themeColorForeground,
				headerStyle: { backgroundColor: themeColorBackground },
				headerTitleStyle: {
					fontWeight: "600",
					color: themeColorForeground,
				},
				headerRight: renderThemeToggle,
				drawerStyle: { backgroundColor: themeColorBackground },
			}}
		>
			<Drawer.Screen
				name="accordion"
				options={{
					headerTitle: "Accordion Demo",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Accordion Demo
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="arrow-down-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="alert-dialog"
				options={{
					headerTitle: "Alert Dialog",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Alert Dialog
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="alert-circle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="aspect-ratio"
				options={{
					headerTitle: "Aspect Ratio",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Aspect Ratio
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="image-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="avatar"
				options={{
					headerTitle: "Avatar",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Avatar
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="person-circle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="checkbox"
				options={{
					headerTitle: "Checkbox",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Checkbox
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="checkbox-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="collapsible"
				options={{
					headerTitle: "Collapsible",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Collapsible
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="chevron-down-circle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="button"
				options={{
					headerTitle: "Button",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Button
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="square-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="context-menu"
				options={{
					headerTitle: "Context Menu",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Context Menu
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="ellipsis-vertical-circle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="dialog"
				options={{
					headerTitle: "Dialog",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Dialog
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="albums-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="dropdown-menu"
				options={{
					headerTitle: "Dropdown Menu",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Dropdown Menu
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="list-circle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="hover-card"
				options={{
					headerTitle: "Hover Card",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Hover Card
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="tablet-landscape-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="label"
				options={{
					headerTitle: "Label",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Label
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="bookmark-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="menubar"
				options={{
					headerTitle: "Menubar",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Menubar
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="grid-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="navigation-menu"
				options={{
					headerTitle: "Navigation Menu",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Navigation Menu
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="compass-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="popover"
				options={{
					headerTitle: "Popover",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Popover
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="chatbubble-ellipses-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="input"
				options={{
					headerTitle: "Input",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Input
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="text-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="progress"
				options={{
					headerTitle: "Progress",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Progress
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="hourglass-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="radio-group"
				options={{
					headerTitle: "Radio Group",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Radio Group
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="radio-button-on-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="select"
				options={{
					headerTitle: "Select",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Select
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="list-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="separator"
				options={{
					headerTitle: "Separator",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Separator
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="reorder-two-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="slider"
				options={{
					headerTitle: "Slider",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Slider
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="git-commit-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="file-input"
				options={{
					headerTitle: "File Input",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							File Input
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="cloud-upload-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="switch"
				options={{
					headerTitle: "Switch",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Switch
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="toggle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="card"
				options={{
					headerTitle: "Card",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Card
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="card-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="chip"
				options={{
					headerTitle: "Chip",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Chip
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="bookmark-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="tabs"
				options={{
					headerTitle: "Tabs",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Tabs
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="folder-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="table"
				options={{
					headerTitle: "Table",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Table
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="list-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="text"
				options={{
					headerTitle: "Text",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Text
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="text-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="toast"
				options={{
					headerTitle: "Toast",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Toast
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="notifications-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="toggle"
				options={{
					headerTitle: "Toggle",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Toggle
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="toggle-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="toolbar"
				options={{
					headerTitle: "Toolbar",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Toolbar
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="construct-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="tooltip"
				options={{
					headerTitle: "Tooltip",
					drawerLabel: ({ color, focused }) => (
						<Text style={{ color: focused ? color : themeColorForeground }}>
							Tooltip
						</Text>
					),
					drawerIcon: ({ size, color, focused }) => (
						<Ionicons
							name="chatbox-ellipses-outline"
							size={size}
							color={focused ? color : themeColorForeground}
						/>
					),
				}}
			/>
		</Drawer>



	);
}

export default DrawerLayout;
