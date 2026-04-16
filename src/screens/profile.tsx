import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserProfile {
	name: string;
	bio: string;
	photoUrl: string;
	favoriteRecipeId: string | null;
	householdName: string;
	isHouseholdOwner: boolean;
}

interface UserRecipe {
	id: string;
	title: string;
}

interface ProfileScreenProps {
	profile: UserProfile;
	householdMembers: string[];
	householdInviteCode: string;
	recipes: UserRecipe[];
	onProfileChange: (nextValues: { name: string; bio: string; photoUrl: string; householdName: string }) => void;
	onAcceptHouseholdInvite: (inviteCode: string, inviteeName: string) => { ok: boolean; message: string };
	onRegenerateInviteCode: () => void;
	onFavoriteRecipeChange: (recipeId: string | null) => void;
}

export function ProfileScreen({
	profile,
	householdMembers,
	householdInviteCode,
	recipes,
	onProfileChange,
	onAcceptHouseholdInvite,
	onRegenerateInviteCode,
	onFavoriteRecipeChange,
}: ProfileScreenProps) {
	const favoriteRecipe = recipes.find((recipe) => recipe.id === profile.favoriteRecipeId) ?? null;
	const [isEditMode, setIsEditMode] = useState(false);
	const [editName, setEditName] = useState(profile.name);
	const [editBio, setEditBio] = useState(profile.bio);
	const [editPhotoUrl, setEditPhotoUrl] = useState(profile.photoUrl);
	const [editHouseholdName, setEditHouseholdName] = useState(profile.householdName);
	const [inviteeName, setInviteeName] = useState('');
	const [inviteCodeInput, setInviteCodeInput] = useState('');

	const handlePickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setEditPhotoUrl(result.assets[0].uri);
		}
	};

	const handleSaveEdit = () => {
		onProfileChange({
			name: editName.trim() || profile.name,
			bio: editBio.trim(),
			photoUrl: editPhotoUrl,
			householdName: editHouseholdName.trim() || profile.householdName,
		});
		setIsEditMode(false);
	};

	const handleCancelEdit = () => {
		setEditName(profile.name);
		setEditBio(profile.bio);
		setEditPhotoUrl(profile.photoUrl);
		setEditHouseholdName(profile.householdName);
		setInviteeName('');
		setInviteCodeInput('');
		setIsEditMode(false);
	};

	const handleAcceptInvite = () => {
		const result = onAcceptHouseholdInvite(inviteCodeInput, inviteeName);
		Alert.alert(result.ok ? 'Invite accepted' : 'Invite failed', result.message);
		if (result.ok) {
			setInviteeName('');
			setInviteCodeInput('');
		}
	};

	if (isEditMode) {
		return (
			<SafeAreaView style={styles.screen} edges={['left', 'right']}>
				<View style={styles.editHeader}>
					<Text style={styles.editTitle}>Edit profile</Text>
					<View style={styles.editHeaderButtons}>
						<TouchableOpacity style={styles.headerButton} activeOpacity={0.8} onPress={handleCancelEdit}>
							<Text style={styles.headerButtonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.headerButton, styles.saveButton]} activeOpacity={0.8} onPress={handleSaveEdit}>
							<Text style={[styles.headerButtonText, styles.saveButtonText]}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>

				<ScrollView style={styles.editContent} contentContainerStyle={styles.editContentInner} keyboardShouldPersistTaps="handled">
					<View style={styles.photoPickerRow}>
						{editPhotoUrl ? (
							<Image source={{ uri: editPhotoUrl }} style={styles.editAvatar} />
						) : (
							<View style={[styles.editAvatar, styles.avatarFallback]}>
								<Text style={styles.avatarFallbackText}>{(editName.trim().charAt(0) || 'U').toUpperCase()}</Text>
							</View>
						)}
						<TouchableOpacity style={styles.uploadButton} activeOpacity={0.85} onPress={handlePickImage}>
							<Ionicons name="image" size={18} color="#ffffff" />
							<Text style={styles.uploadButtonText}>Upload photo</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.editCard}>
						<Text style={styles.editLabel}>Name</Text>
						<TextInput
							style={styles.editInput}
							placeholder="Your name"
							placeholderTextColor="#9ca3af"
							value={editName}
							onChangeText={setEditName}
						/>

						<Text style={styles.editLabel}>Bio</Text>
						<TextInput
							style={[styles.editInput, styles.bioInput]}
							placeholder="Tell people what you love cooking"
							placeholderTextColor="#9ca3af"
							multiline
							value={editBio}
							onChangeText={setEditBio}
						/>

						<Text style={styles.editLabel}>Household name</Text>
						<TextInput
							style={[styles.editInput, !profile.isHouseholdOwner ? styles.disabledInput : null]}
							placeholder="Your household"
							placeholderTextColor="#9ca3af"
							value={editHouseholdName}
							editable={profile.isHouseholdOwner}
							onChangeText={setEditHouseholdName}
						/>
						{!profile.isHouseholdOwner ? <Text style={styles.memberRestrictionText}>Only the household owner can rename the household.</Text> : null}

						<Text style={styles.editLabel}>Invite code</Text>
						<View style={styles.inviteCodeRow}>
							<Text style={styles.inviteCodeValue}>{householdInviteCode}</Text>
							{profile.isHouseholdOwner ? (
								<TouchableOpacity style={styles.regenerateButton} activeOpacity={0.85} onPress={onRegenerateInviteCode}>
									<Text style={styles.regenerateButtonText}>New code</Text>
								</TouchableOpacity>
							) : null}
						</View>
						<Text style={styles.inviteHint}>Share this code so someone can join your household.</Text>

						<Text style={styles.editLabel}>Accept invite into household</Text>
						<TextInput
							style={styles.editInput}
							placeholder="Invitee name"
							placeholderTextColor="#9ca3af"
							value={inviteeName}
							onChangeText={setInviteeName}
						/>
						<TextInput
							style={styles.editInput}
							placeholder="Invite code"
							placeholderTextColor="#9ca3af"
							autoCapitalize="characters"
							value={inviteCodeInput}
							onChangeText={setInviteCodeInput}
						/>
						<TouchableOpacity style={styles.addMemberButton} activeOpacity={0.85} onPress={handleAcceptInvite}>
							<Text style={styles.addMemberButtonText}>Accept invite</Text>
						</TouchableOpacity>

						<Text style={styles.editLabel}>Household roster</Text>
						<View style={styles.memberList}>
							{householdMembers.map((member, index) => (
								<View key={member} style={styles.memberChip}>
									<Text style={styles.memberChipText}>{index === 0 ? `${member} (owner)` : member}</Text>
								</View>
							))}
						</View>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.screen} edges={['left', 'right']}>
			<View style={styles.viewHeader}>
				<View>
					<Text style={styles.eyebrow}>Profile</Text>
					<Text style={styles.title}>Your kitchen identity</Text>
				</View>
				<TouchableOpacity style={styles.editButtonTopRight} activeOpacity={0.8} onPress={() => setIsEditMode(true)}>
					<Ionicons name="pencil" size={20} color="#111111" />
				</TouchableOpacity>
			</View>

			<ScrollView style={styles.viewContent} contentContainerStyle={styles.viewContentInner}>
				<View style={styles.profileCard}>
					<View style={styles.profileAvatarRow}>
						{profile.photoUrl ? (
							<Image source={{ uri: profile.photoUrl }} style={styles.profileAvatar} />
						) : (
							<View style={[styles.profileAvatar, styles.avatarFallback]}>
								<Text style={styles.avatarFallbackText}>{(profile.name.trim().charAt(0) || 'U').toUpperCase()}</Text>
							</View>
						)}
						<View style={styles.profileInfo}>
							<Text style={styles.profileName}>{profile.name}</Text>
							<Text style={styles.householdText}>{profile.householdName}</Text>
							{profile.bio ? <Text style={styles.profileBio}>{profile.bio}</Text> : null}
						</View>
					</View>
				</View>

				<View style={styles.card}>
					<Text style={styles.favoriteTitle}>Household</Text>
					<Text style={styles.householdBody}>Recipes and meal plans in this app are shared with {profile.householdName}.</Text>
					<View style={styles.memberList}>
						{householdMembers.map((member, index) => (
							<View key={`household-${member}`} style={styles.memberChip}>
								<Text style={styles.memberChipText}>{index === 0 ? `${member} (owner)` : member}</Text>
							</View>
						))}
					</View>
				</View>

				<View style={styles.card}>
					<View style={styles.favoriteHeader}>
						<Text style={styles.favoriteTitle}>Favorite recipe</Text>
						{favoriteRecipe ? <Text style={styles.favoriteCurrent}>{favoriteRecipe.title}</Text> : null}
					</View>

					{recipes.length === 0 ? (
						<Text style={styles.emptyText}>Add a recipe first, then choose one favorite here.</Text>
					) : (
						<>
							{recipes.map((recipe) => {
								const isFavorite = recipe.id === profile.favoriteRecipeId;

								return (
									<TouchableOpacity
										key={recipe.id}
										style={[styles.recipeOption, isFavorite ? styles.recipeOptionActive : null]}
										onPress={() => onFavoriteRecipeChange(isFavorite ? null : recipe.id)}
										activeOpacity={0.9}
									>
										<Text style={[styles.recipeOptionText, isFavorite ? styles.recipeOptionTextActive : null]}>{recipe.title}</Text>
										<Text style={[styles.recipeOptionBadge, isFavorite ? styles.recipeOptionBadgeActive : null]}>
											{isFavorite ? 'Favorite' : 'Set favorite'}
										</Text>
									</TouchableOpacity>
								);
							})}
						</>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	viewHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingHorizontal: 24,
		paddingTop: 20,
		paddingBottom: 24,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	editHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e5e7eb',
	},
	editTitle: {
		color: '#111111',
		fontSize: 18,
		fontWeight: '700',
	},
	editHeaderButtons: {
		flexDirection: 'row',
		gap: 8,
	},
	headerButton: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#d1d5db',
	},
	headerButtonText: {
		color: '#111111',
		fontSize: 14,
		fontWeight: '600',
	},
	saveButton: {
		backgroundColor: '#111111',
		borderColor: '#111111',
	},
	saveButtonText: {
		color: '#ffffff',
	},
	editButtonTopRight: {
		width: 40,
		height: 40,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f3f4f6',
	},
	viewContent: {
		flex: 1,
	},
	viewContentInner: {
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 100,
		gap: 14,
	},
	editContent: {
		flex: 1,
	},
	editContentInner: {
		paddingHorizontal: 16,
		paddingTop: 40,
		paddingBottom: 120,
	},
	photoPickerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		marginBottom: 20,
	},
	editAvatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
	},
	uploadButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#111111',
		paddingHorizontal: 14,
		paddingVertical: 12,
		borderRadius: 10,
	},
	uploadButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '700',
	},
	profileCard: {
		borderRadius: 14,
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		padding: 14,
	},
	profileAvatarRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	profileAvatar: {
		width: 80,
		height: 80,
		borderRadius: 40,
	},
	profileInfo: {
		flex: 1,
	},
	profileName: {
		color: '#111111',
		fontSize: 18,
		fontWeight: '800',
	},
	profileBio: {
		marginTop: 4,
		color: '#6b7280',
		fontSize: 13,
		lineHeight: 18,
	},
	householdText: {
		marginTop: 4,
		color: '#0077b6',
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 0.8,
	},
	editCard: {
		borderRadius: 14,
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		padding: 14,
		marginBottom: 20,
	},
	editLabel: {
		fontSize: 13,
		fontWeight: '700',
		color: '#111111',
		marginBottom: 8,
		marginTop: 10,
	},
	editInput: {
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 10,
		backgroundColor: '#ffffff',
		color: '#111111',
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 14,
	},
	bioInput: {
		minHeight: 90,
		textAlignVertical: 'top',
	},
	memberList: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 10,
	},
	memberChip: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: '#ffffff',
		borderWidth: 1,
		borderColor: '#d1d5db',
	},
	memberChipText: {
		color: '#111111',
		fontSize: 12,
		fontWeight: '700',
	},
	disabledInput: {
		opacity: 0.6,
	},
	memberRestrictionText: {
		marginTop: 8,
		color: '#6b7280',
		fontSize: 12,
		lineHeight: 18,
	},
	inviteCodeRow: {
		marginTop: 2,
		borderWidth: 1,
		borderColor: '#d1d5db',
		borderRadius: 10,
		padding: 10,
		backgroundColor: '#ffffff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 10,
	},
	inviteCodeValue: {
		color: '#111111',
		fontSize: 16,
		fontWeight: '800',
		letterSpacing: 1.2,
	},
	regenerateButton: {
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 8,
		backgroundColor: '#111111',
	},
	regenerateButtonText: {
		color: '#ffffff',
		fontSize: 12,
		fontWeight: '700',
		textTransform: 'uppercase',
	},
	inviteHint: {
		marginTop: 8,
		color: '#6b7280',
		fontSize: 12,
		lineHeight: 18,
	},
	addMemberButton: {
		borderRadius: 10,
		backgroundColor: '#111111',
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	addMemberButtonText: {
		color: '#ffffff',
		fontSize: 13,
		fontWeight: '700',
	},
	eyebrow: {
		color: '#0077b6',
		fontSize: 13,
		fontWeight: '700',
		textTransform: 'uppercase',
		letterSpacing: 1.2,
		marginBottom: 10,
	},
	title: {
		color: '#111111',
		fontSize: 32,
		fontWeight: '800',
		marginBottom: 10,
	},
	content: {
		paddingHorizontal: 24,
		paddingTop: 56,
		paddingBottom: 120,
		gap: 14,
	},
	card: {
		marginTop: 6,
		borderRadius: 20,
		backgroundColor: '#f9fafb',
		borderWidth: 1,
		borderColor: '#e5e7eb',
		padding: 16,
	},
	avatarFallback: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#e5e7eb',
	},
	avatarFallbackText: {
		fontSize: 22,
		fontWeight: '800',
		color: '#111111',
	},
	favoriteHeader: {
		marginBottom: 8,
		gap: 6,
	},
	favoriteTitle: {
		fontSize: 18,
		fontWeight: '800',
		color: '#111111',
	},
	favoriteCurrent: {
		fontSize: 14,
		color: '#6b7280',
		fontWeight: '600',
	},
	householdBody: {
		marginTop: 8,
		fontSize: 14,
		lineHeight: 20,
		color: '#6b7280',
	},
	emptyText: {
		fontSize: 14,
		color: '#6b7280',
		lineHeight: 20,
	},
	recipeOption: {
		marginTop: 10,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#d1d5db',
		backgroundColor: '#fff',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 10,
	},
	recipeOptionActive: {
		backgroundColor: '#111111',
		borderColor: '#111111',
	},
	recipeOptionText: {
		flex: 1,
		color: '#111111',
		fontSize: 14,
		fontWeight: '700',
	},
	recipeOptionTextActive: {
		color: '#ffffff',
	},
	recipeOptionBadge: {
		fontSize: 11,
		fontWeight: '700',
		color: '#6b7280',
		textTransform: 'uppercase',
	},
	recipeOptionBadgeActive: {
		color: '#bde9ff',
	},
});
