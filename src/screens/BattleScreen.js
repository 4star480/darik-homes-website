import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function BattleScreen() {
  const [gameState, setGameState] = useState({
    wave: 1,
    health: 100,
    gold: 1000,
    score: 0
  });

  const [isGameActive, setIsGameActive] = useState(false);
  const [selectedTower, setSelectedTower] = useState(null);

  const towerTypes = {
    archer: { name: 'Archer Tower', cost: 100, icon: 'sports-swords', color: '#8B4513' },
    cannon: { name: 'Cannon Tower', cost: 200, icon: 'explosion', color: '#696969' },
    magic: { name: 'Magic Tower', cost: 300, icon: 'auto-fix-high', color: '#8A2BE2' }
  };

  const handleStartWave = () => {
    if (gameState.health <= 0) {
      Alert.alert('Game Over', 'Your kingdom has fallen! Try again.');
      return;
    }

    setIsGameActive(true);
    Alert.alert('Wave Started', `Wave ${gameState.wave} has begun!`);
  };

  const handleTowerSelect = (towerType) => {
    setSelectedTower(towerType);
    Alert.alert('Tower Selected', `Selected ${towerTypes[towerType].name}`);
  };

  const handleWaveComplete = () => {
    const reward = 100;
    setGameState(prev => ({
      ...prev,
      wave: prev.wave + 1,
      gold: prev.gold + reward,
      score: prev.score + reward
    }));
    setIsGameActive(false);
    Alert.alert('Wave Complete!', `You earned ${reward} gold!`);
  };

  return (
    <LinearGradient colors={['#2C1810', '#8B4513']} style={styles.container}>
      <View style={styles.gameHeader}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Icon name="favorite" size={20} color="#DC143C" />
            <Text style={styles.statText}>Health: {gameState.health}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="monetization-on" size={20} color="#FFD700" />
            <Text style={styles.statText}>Gold: {gameState.gold}</Text>
          </View>
          <View style={styles.statItem}>
            <Icon name="waves" size={20} color="#D4AF37" />
            <Text style={styles.statText}>Wave: {gameState.wave}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.gameField}>
          <Text style={styles.gameFieldText}>Tower Defense Game Area</Text>
          <Text style={styles.gameFieldSubtext}>Place towers to defend your kingdom!</Text>
        </View>
      </View>

      <View style={styles.towerSelection}>
        <Text style={styles.selectionTitle}>Select Tower:</Text>
        <View style={styles.towerButtons}>
          {Object.entries(towerTypes).map(([type, tower]) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.towerButton,
                selectedTower === type && styles.selectedTower
              ]}
              onPress={() => handleTowerSelect(type)}
            >
              <Icon name={tower.icon} size={24} color={tower.color} />
              <Text style={styles.towerName}>{tower.name}</Text>
              <Text style={styles.towerCost}>Cost: {tower.cost}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.gameControls}>
        {!isGameActive ? (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWave}
          >
            <Icon name="play-arrow" size={24} color="#2C1810" />
            <Text style={styles.startButtonText}>Start Wave {gameState.wave}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.pauseButton}
            onPress={() => setIsGameActive(false)}
          >
            <Icon name="pause" size={24} color="#2C1810" />
            <Text style={styles.pauseButtonText}>Pause</Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameHeader: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  gameArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameField: {
    alignItems: 'center',
  },
  gameFieldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  gameFieldSubtext: {
    fontSize: 14,
    color: '#8B4513',
    textAlign: 'center',
  },
  towerSelection: {
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  selectionTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  towerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  towerButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
    minWidth: 80,
  },
  selectedTower: {
    borderColor: '#D4AF37',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  towerName: {
    color: '#D4AF37',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  towerCost: {
    color: '#8B4513',
    fontSize: 10,
    marginTop: 2,
  },
  gameControls: {
    padding: 15,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  startButtonText: {
    color: '#2C1810',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pauseButton: {
    backgroundColor: '#DC143C',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  pauseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});