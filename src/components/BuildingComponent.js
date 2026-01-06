import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BuildingComponent({ building, onPress }) {
  const buildingIcons = {
    townhall: 'home',
    barracks: 'sports-swords',
    quarry: 'terrain',
    lumbermill: 'eco',
    farm: 'restaurant',
    market: 'store'
  };

  const buildingColors = {
    townhall: '#D4AF37',
    barracks: '#8B4513',
    quarry: '#696969',
    lumbermill: '#228B22',
    farm: '#32CD32',
    market: '#FFD700'
  };

  return (
    <TouchableOpacity
      style={styles.buildingCard}
      onPress={onPress}
    >
      <View style={styles.buildingIcon}>
        <Icon 
          name={buildingIcons[building.type] || 'home'} 
          size={40} 
          color={buildingColors[building.type] || '#D4AF37'} 
        />
      </View>
      <Text style={styles.buildingName}>{building.name}</Text>
      <Text style={styles.buildingLevel}>Level {building.level}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buildingCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B4513',
    minWidth: 100,
  },
  buildingIcon: {
    marginBottom: 10,
  },
  buildingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 5,
  },
  buildingLevel: {
    fontSize: 12,
    color: '#8B4513',
  },
});