import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function HeroesScreen() {
  const [heroes, setHeroes] = useState([
    {
      id: 1,
      name: 'Sir Galahad',
      type: 'knight',
      level: 1,
      rarity: 'common',
      attack: 50,
      defense: 30,
      health: 100,
      skills: ['Shield Bash', 'Defensive Stance'],
      isUnlocked: true
    },
    {
      id: 2,
      name: 'Elven Archer',
      type: 'archer',
      level: 1,
      rarity: 'rare',
      attack: 75,
      defense: 20,
      health: 80,
      skills: ['Precise Shot', 'Multi-Arrow'],
      isUnlocked: false
    },
    {
      id: 3,
      name: 'Dragon Mage',
      type: 'mage',
      level: 1,
      rarity: 'epic',
      attack: 100,
      defense: 15,
      health: 90,
      skills: ['Fireball', 'Dragon Breath'],
      isUnlocked: false
    }
  ]);

  const [selectedHero, setSelectedHero] = useState(null);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [resources, setResources] = useState({
    gold: 1000,
    gems: 50
  });

  const heroTypes = {
    knight: { icon: 'sports-swords', color: '#8B4513' },
    archer: { icon: 'sports-swords', color: '#228B22' },
    mage: { icon: 'auto-fix-high', color: '#8A2BE2' }
  };

  const rarityColors = {
    common: '#8B4513',
    rare: '#228B22',
    epic: '#8A2BE2',
    legendary: '#FFD700'
  };

  const handleHeroPress = (hero) => {
    setSelectedHero(hero);
    setShowHeroModal(true);
  };

  const handleUnlockHero = () => {
    if (!selectedHero || selectedHero.isUnlocked) return;

    const unlockCost = selectedHero.rarity === 'common' ? 100 : 
                      selectedHero.rarity === 'rare' ? 500 : 
                      selectedHero.rarity === 'epic' ? 1000 : 2000;

    if (resources.gold >= unlockCost) {
      setResources(prev => ({ ...prev, gold: prev.gold - unlockCost }));
      setHeroes(prev => prev.map(hero => 
        hero.id === selectedHero.id 
          ? { ...hero, isUnlocked: true }
          : hero
      ));
      Alert.alert('Hero Unlocked!', `${selectedHero.name} has joined your army!`);
      setShowHeroModal(false);
    } else {
      Alert.alert('Insufficient Gold', 'You need more gold to unlock this hero.');
    }
  };

  const handleUpgradeHero = () => {
    if (!selectedHero || !selectedHero.isUnlocked) return;

    const upgradeCost = selectedHero.level * 100;
    if (resources.gold >= upgradeCost) {
      setResources(prev => ({ ...prev, gold: prev.gold - upgradeCost }));
      setHeroes(prev => prev.map(hero => 
        hero.id === selectedHero.id 
          ? { 
              ...hero, 
              level: hero.level + 1,
              attack: hero.attack + 10,
              defense: hero.defense + 5,
              health: hero.health + 20
            }
          : hero
      ));
      Alert.alert('Hero Upgraded!', `${selectedHero.name} is now level ${selectedHero.level + 1}!`);
      setShowHeroModal(false);
    } else {
      Alert.alert('Insufficient Gold', 'You need more gold to upgrade this hero.');
    }
  };

  const handleGachaRoll = () => {
    if (resources.gems < 10) {
      Alert.alert('Insufficient Gems', 'You need 10 gems to roll for heroes.');
      return;
    }

    setResources(prev => ({ ...prev, gems: prev.gems - 10 }));
    
    const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
    Alert.alert('Gacha Roll!', `You got ${randomHero.name}!`);
  };

  return (
    <LinearGradient colors={['#2C1810', '#8B4513']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.resourceContainer}>
          <View style={styles.resourceItem}>
            <Icon name="monetization-on" size={20} color="#FFD700" />
            <Text style={styles.resourceText}>Gold: {resources.gold}</Text>
          </View>
          <View style={styles.resourceItem}>
            <Icon name="diamond" size={20} color="#8A2BE2" />
            <Text style={styles.resourceText}>Gems: {resources.gems}</Text>
          </View>
        </View>

        <View style={styles.gachaContainer}>
          <Text style={styles.sectionTitle}>Hero Recruitment</Text>
          <TouchableOpacity
            style={styles.gachaButton}
            onPress={handleGachaRoll}
          >
            <Icon name="casino" size={24} color="#D4AF37" />
            <Text style={styles.gachaButtonText}>Roll for Heroes (10 Gems)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroesContainer}>
          <Text style={styles.sectionTitle}>Your Heroes</Text>
          {heroes.map((hero) => (
            <TouchableOpacity
              key={hero.id}
              style={[
                styles.heroCard,
                !hero.isUnlocked && styles.lockedHero
              ]}
              onPress={() => handleHeroPress(hero)}
            >
              <View style={styles.heroHeader}>
                <Icon 
                  name={heroTypes[hero.type].icon} 
                  size={30} 
                  color={heroTypes[hero.type].color} 
                />
                <View style={styles.heroInfo}>
                  <Text style={styles.heroName}>{hero.name}</Text>
                  <Text style={[
                    styles.heroRarity,
                    { color: rarityColors[hero.rarity] }
                  ]}>
                    {hero.rarity.toUpperCase()}
                  </Text>
                </View>
                {!hero.isUnlocked && (
                  <Icon name="lock" size={20} color="#DC143C" />
                )}
              </View>
              
              <View style={styles.heroStats}>
                <Text style={styles.statText}>Level: {hero.level}</Text>
                <Text style={styles.statText}>Attack: {hero.attack}</Text>
                <Text style={styles.statText}>Defense: {hero.defense}</Text>
                <Text style={styles.statText}>Health: {hero.health}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showHeroModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHeroModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedHero && (
              <>
                <View style={styles.modalHeader}>
                  <Icon 
                    name={heroTypes[selectedHero.type].icon} 
                    size={40} 
                    color={heroTypes[selectedHero.type].color} 
                  />
                  <Text style={styles.modalTitle}>{selectedHero.name}</Text>
                  <Text style={[
                    styles.modalRarity,
                    { color: rarityColors[selectedHero.rarity] }
                  ]}>
                    {selectedHero.rarity.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.heroDetails}>
                  <Text style={styles.detailTitle}>Level: {selectedHero.level}</Text>
                  <Text style={styles.detailText}>Attack: {selectedHero.attack}</Text>
                  <Text style={styles.detailText}>Defense: {selectedHero.defense}</Text>
                  <Text style={styles.detailText}>Health: {selectedHero.health}</Text>
                  
                  <Text style={styles.skillsTitle}>Skills:</Text>
                  {selectedHero.skills.map((skill, index) => (
                    <Text key={index} style={styles.skillText}>• {skill}</Text>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  {!selectedHero.isUnlocked ? (
                    <TouchableOpacity
                      style={styles.unlockButton}
                      onPress={handleUnlockHero}
                    >
                      <Text style={styles.unlockButtonText}>
                        Unlock ({selectedHero.rarity === 'common' ? 100 : 
                                 selectedHero.rarity === 'rare' ? 500 : 
                                 selectedHero.rarity === 'epic' ? 1000 : 2000} Gold)
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.upgradeButton}
                      onPress={handleUpgradeHero}
                    >
                      <Text style={styles.upgradeButtonText}>
                        Upgrade ({selectedHero.level * 100} Gold)
                      </Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowHeroModal(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  resourceContainer: {
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
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
    textAlign: 'center',
  },
  gachaContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  gachaButton: {
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  gachaButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  heroesContainer: {
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  lockedHero: {
    opacity: 0.5,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroInfo: {
    flex: 1,
    marginLeft: 10,
  },
  heroName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  heroRarity: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statText: {
    color: '#8B4513',
    marginRight: 15,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2C1810',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 10,
  },
  modalRarity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  heroDetails: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 5,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 10,
    marginBottom: 5,
  },
  skillText: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  unlockButton: {
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  unlockButtonText: {
    color: '#2C1810',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  upgradeButton: {
    backgroundColor: '#228B22',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  closeButtonText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});