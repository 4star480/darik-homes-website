import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ResourceDisplay({ resources }) {
  return (
    <View style={styles.container}>
      <View style={styles.resourceItem}>
        <Icon name="monetization-on" size={20} color="#FFD700" />
        <Text style={styles.resourceText}>{resources.gold}</Text>
      </View>
      <View style={styles.resourceItem}>
        <Icon name="eco" size={20} color="#8B4513" />
        <Text style={styles.resourceText}>{resources.wood}</Text>
      </View>
      <View style={styles.resourceItem}>
        <Icon name="terrain" size={20} color="#696969" />
        <Text style={styles.resourceText}>{resources.stone}</Text>
      </View>
      <View style={styles.resourceItem}>
        <Icon name="restaurant" size={20} color="#32CD32" />
        <Text style={styles.resourceText}>{resources.food}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
});