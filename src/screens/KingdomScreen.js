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

export default function KingdomScreen() {
  const [resources, setResources] = useState({
    gold: 1000,
    wood: 500,
    stone: 300,
    food: 200
  });

  const [buildings, setBuildings] = useState([
    { id: 1, type: 'townhall', level: 1, name: 'Town Hall' },
    { id: 2, type: 'barracks', level: 1, name: 'Barracks' },
    { id: 3, type: 'quarry', level: 1, name: 'Quarry' },
    { id: 4, type: 'lumbermill', level: 1, name: 'Lumber Mill' },
  ]);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showBuildingModal, setShowBuildingModal] = useState(false);

  const handleBuildingPress = (building) => {
    setSelectedBuilding(building);
    setShowBuildingModal(true);
  };

  const handleUpgradeBuilding = () => {
    if (!selectedBuilding) return;

    const upgradeCost = { gold: 100, wood: 50, stone: 25 };

    if (resources.gold >= upgradeCost.gold && 
        resources.wood >= upgradeCost.wood && 
        resources.stone >= upgradeCost.stone) {
      
      setResources(prev => ({
        gold: prev.gold - upgradeCost.gold,
        wood: prev.wood - upgradeCost.wood,
        stone: prev.stone - upgradeCost.stone
      }));

      setBuildings(prev => prev.map(building => 
        building.id === selectedBuilding.id 
          ? { ...building, level: building.level + 1 }
          : building
      ));

      Alert.alert('Success', `${selectedBuilding.name} upgraded to level ${selectedBuilding.level + 1}!`);
      setShowBuildingModal(false);
    } else {
      Alert.alert('Insufficient Resources', 'You need more resources to upgrade this building.');
    }
  };

  const handleCollectResources = () => {
    setResources(prev => ({
      gold: prev.gold + 50,
      wood: prev.wood + 30,
      stone: prev.stone + 20,
      food: prev.food + 10
    }));
    Alert.alert('Resources Collected', 'You collected resources from your buildings!');
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
            <Icon name="eco" size={20} color="#8B4513" />
            <Text style={styles.resourceText}>Wood: {resources.wood}</Text>
          </View>
          <View style={styles.resourceItem}>
            <Icon name="terrain" size={20} color="#696969" />
            <Text style={styles.resourceText}>Stone: {resources.stone}</Text>
          </View>
        </View>

        <View style={styles.kingdomContainer}>
          <Text style={styles.sectionTitle}>Your Kingdom</Text>
          
          <View style={styles.kingdomGrid}>
            {buildings.map((building) => (
              <TouchableOpacity
                key={building.id}
                style={styles.buildingCard}
                onPress={() => handleBuildingPress(building)}
              >
                <Icon name="home" size={40} color="#D4AF37" />
                <Text style={styles.buildingName}>{building.name}</Text>
                <Text style={styles.buildingLevel}>Level {building.level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCollectResources}
          >
            <Icon name="monetization-on" size={20} color="#D4AF37" />
            <Text style={styles.actionButtonText}>Collect Resources</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showBuildingModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBuildingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBuilding && (
              <>
                <View style={styles.modalHeader}>
                  <Icon name="home" size={30} color="#D4AF37" />
                  <Text style={styles.modalTitle}>
                    {selectedBuilding.name} (Level {selectedBuilding.level})
                  </Text>
                </View>
                
                <Text style={styles.modalDescription}>
                  Main building of your kingdom
                </Text>

                <View style={styles.upgradeInfo}>
                  <Text style={styles.upgradeTitle}>Upgrade Cost:</Text>
                  <Text style={styles.upgradeText}>Gold: 100</Text>
                  <Text style={styles.upgradeText}>Wood: 50</Text>
                  <Text style={styles.upgradeText}>Stone: 25</Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={handleUpgradeBuilding}
                  >
                    <Text style={styles.upgradeButtonText}>Upgrade</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowBuildingModal(false)}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 20,
    textAlign: 'center',
  },
  kingdomContainer: {
    marginBottom: 30,
  },
  kingdomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
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
  buildingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  buildingLevel: {
    fontSize: 12,
    color: '#8B4513',
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    color: '#2C1810',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
    width: '80%',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginLeft: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 20,
  },
  upgradeInfo: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  upgradeText: {
    fontSize: 14,
    color: '#8B4513',
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  upgradeButton: {
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  upgradeButtonText: {
    color: '#2C1810',
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