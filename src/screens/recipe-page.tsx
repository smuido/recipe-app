import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Recipe {
    id: string;
    title: string;
    image: string;
    tags: string[];
    prepTime: number;
    cookTime: number;
    ingredients: string[];
    steps: string[];
}

interface RecipePageProps {
    recipe: Recipe;
    onClose: () => void;
    onSaveForLater: () => void;
}

export function RecipePage({ recipe, onClose, onSaveForLater }: RecipePageProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backdrop} onPress={onClose} />
            
            <View style={styles.modal}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Recipe Image */}
                    <Image source={{ uri: recipe.image }} style={styles.image} />
                    
                    {/* Tags, Times */}
                    <View style={styles.header}>
                        <View style={styles.tags}>
                            {recipe.tags.map((tag) => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                        
                        <View style={styles.times}>
                            <View style={styles.timeItem}>
                                <Text style={styles.timeLabel}>Prep</Text>
                                <Text style={styles.timeValue}>{recipe.prepTime}m</Text>
                            </View>
                            <View style={styles.timeItem}>
                                <Text style={styles.timeLabel}>Cook</Text>
                                <Text style={styles.timeValue}>{recipe.cookTime}m</Text>
                            </View>
                        </View>
                    </View>
                    
                    {/* Ingredients */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        {recipe.ingredients.map((ingredient, index) => (
                            <Text key={`${ingredient}-${index}`} style={styles.ingredient}>
                                • {ingredient}
                            </Text>
                        ))}
                    </View>
                    
                    {/* Steps */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        {recipe.steps.map((step, index) => (
                            <Text key={`${step}-${index}`} style={styles.step}>
                                {index + 1}. {step}
                            </Text>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={onSaveForLater}>
                        <Text style={styles.saveButtonText}>Save for later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modal: {
        width: '85%',
        maxHeight: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#ffffff',
    },
    saveButton: {
        borderRadius: 14,
        backgroundColor: '#111111',
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
    image: {
        width: '100%',
        height: 250,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#e6f7ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        color: '#0077b6',
    },
    times: {
        flexDirection: 'row',
        gap: 20,
    },
    timeItem: {
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    timeValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111111',
    },
    section: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
        color: '#111111',
    },
    ingredient: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 8,
        lineHeight: 20,
    },
    step: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 10,
        lineHeight: 22,
    },
});