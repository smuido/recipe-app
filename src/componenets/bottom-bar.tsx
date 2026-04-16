import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TabId = 'social' | 'myRecipes' | 'discover' | 'createRecipe' | 'pantry' | 'profile';

interface BottomBarProps {
	activeTab: TabId;
	onTabPress: (tab: TabId) => void;
	onCenterActionPress: (tab: 'createRecipe' | 'discover') => void;
}

const TABS: Array<{
	key: TabId;
	label: string;
	icon: React.ComponentProps<typeof Ionicons>['name'];
	activeIcon: React.ComponentProps<typeof Ionicons>['name'];
	isCenter?: boolean;
}> = [
	{ key: 'social', label: 'Planner', icon: 'calendar-outline', activeIcon: 'calendar' },
	{ key: 'myRecipes', label: 'My Recipes', icon: 'book-outline', activeIcon: 'book' },
	{ key: 'discover', label: 'Cook', icon: 'restaurant-outline', activeIcon: 'restaurant', isCenter: true },
	{ key: 'pantry', label: 'Pantry', icon: 'basket-outline', activeIcon: 'basket' },
	{ key: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];


export function BottomBar({ activeTab, onTabPress, onCenterActionPress }: BottomBarProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isCenterActive = activeTab === 'discover' || activeTab === 'createRecipe';

	return (
		<View style={styles.wrap}>
			{isMenuOpen ? (
				<View style={styles.centerMenu}>
					<TouchableOpacity
						style={styles.menuAction}
						onPress={() => {
							setIsMenuOpen(false);
							onCenterActionPress('createRecipe');
						}}
						activeOpacity={0.9}
					>
						<Ionicons name="create-outline" size={18} color="#ffffff" />
						<Text style={styles.menuActionText}>Create recipe</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.menuAction}
						onPress={() => {
							setIsMenuOpen(false);
							onCenterActionPress('discover');
						}}
						activeOpacity={0.9}
					>
						<Ionicons name="sparkles-outline" size={18} color="#ffffff" />
						<Text style={styles.menuActionText}>Discover recipes</Text>
					</TouchableOpacity>
				</View>
			) : null}
			<View style={styles.bar}>
				{TABS.map((tab) => {
					const isActive = tab.isCenter ? isCenterActive : activeTab === tab.key;

					if (tab.isCenter) {
						return (
							<TouchableOpacity
								key={tab.key}
								style={[styles.centerButton, isActive ? styles.centerButtonActive : null]}
								onPress={() => setIsMenuOpen((current) => !current)}
								activeOpacity={0.9}
							>
								<Ionicons name={isMenuOpen ? 'close' : isActive ? tab.activeIcon : tab.icon} size={24} color="#111111" />
							</TouchableOpacity>
						);
					}

					return (
						<TouchableOpacity
							key={tab.key}
							style={styles.tabButton}
							onPress={() => {
								setIsMenuOpen(false);
								onTabPress(tab.key);
							}}
							activeOpacity={0.85}
						>
							<Ionicons
								name={isActive ? tab.activeIcon : tab.icon}
								size={20}
								color={isActive ? '#111111' : '#6b7280'}
							/>
							<Text style={[styles.tabLabel, isActive ? styles.tabLabelActive : null]}>{tab.label}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
	},
	centerMenu: {
		position: 'absolute',
		bottom: 112,
		alignItems: 'center',
		gap: 10,
		zIndex: 2,
	},
	menuAction: {
		minWidth: 180,
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderRadius: 999,
		backgroundColor: '#111111',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 10,
		elevation: 6,
	},
	menuActionText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '700',
	},
	bar: {
		width: '100%',
		height: 88,
		backgroundColor: '#ffffff',
		borderTopWidth: 1,
		borderTopColor: '#e5e7eb',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
		paddingHorizontal: 8,
		paddingTop: 12,
		paddingBottom: 16,
	},
	tabButton: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		gap: 4,
	},
	tabLabel: {
		fontSize: 12,
		fontWeight: '700',
		color: '#6b7280',
		textAlign: 'center',
	},
	tabLabelActive: {
		color: '#111111',
	},
	centerButton: {
		width: 74,
		height: 74,
		borderRadius: 37,
		marginTop: -42,
		backgroundColor: '#00b3ff',
		borderWidth: 4,
		borderColor: '#ffffff',
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#0077b6',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 8,
	},
	centerButtonActive: {
		backgroundColor: '#0090d4',
	},
});
