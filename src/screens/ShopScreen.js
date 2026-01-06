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

export default function ShopScreen() {
  const [resources, setResources] = useState({
    gold: 1000,
    gems: 50,
    wood: 500,
    stone: 300
  });

  const [shopItems, setShopItems] = useState([
    {
      id: 1,
      name: 'Gold Pack',
      description: 'Get 1000 gold instantly',
      price: 10,
      currency: 'gems',
      icon: 'monetization-on',
      color: '#FFD700',
      category: 'resources'
    },
    {
      id: 2,
      name: 'Wood Pack',
      description: 'Get 500 wood instantly',
      price: 5,
      currency: 'gems',
      icon: 'eco',
      color: '#8B4513',
      category: 'resources'
    },
    {
      id: 3,
      name: 'Stone Pack',
      description: 'Get 300 stone instantly',
      price: 5,
      currency: 'gems',
      icon: 'terrain',
      color: '#696969',
      category: 'resources'
    },
    {
      id: 4,
      name: 'Rare Hero',
      description: 'Guaranteed rare hero',
      price: 100,
      currency: 'gems',
      icon: 'person',
      color: '#228B22',
      category: 'heroes'
    },
    {
      id: 5,
      name: 'Epic Hero',
      description: 'Guaranteed epic hero',
      price: 500,
      currency: 'gems',
      icon: 'star',
      color: '#8A2BE2',
      category: 'heroes'
    },
    {
      id: 6,
      name: 'Speed Boost',
      description: '2x building speed for 1 hour',
      price: 20,
      currency: 'gems',
      icon: 'speed',
      color: '#FF4500',
      category: 'boosts'
    },
    {
      id: 7,
      name: 'Resource Boost',
      description: '2x resource production for 1 hour',
      price: 25,
      currency: 'gems',
      icon: 'trending-up',
      color: '#32CD32',
      category: 'boosts'
    },
    {
      id: 8,
      name: 'Premium Pack',
      description: '1000 gems + exclusive hero',
      price: 9.99,
      currency: 'real',
      icon: 'diamond',
      color: '#FFD700',
      category: 'premium'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: 'store' },
    { id: 'resources', name: 'Resources', icon: 'inventory' },
    { id: 'heroes', name: 'Heroes', icon: 'person' },
    { id: 'boosts', name: 'Boosts', icon: 'speed' },
    { id: 'premium', name: 'Premium', icon: 'diamond' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === selectedCategory);

  const handlePurchase = (item) => {
    setSelectedItem(item);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (!selectedItem) return;

    if (selectedItem.currency === 'gems') {
      if (resources.gems < selectedItem.price) {
        Alert.alert('Insufficient Gems', 'You need more gems to purchase this item.');
        setShowPurchaseModal(false);
        return;
      }

      setResources(prev => ({
        ...prev,
        gems: prev.gems - selectedItem.price
      }));

      if (selectedItem.category === 'resources') {
        if (selectedItem.name.includes('Gold')) {
          setResources(prev => ({ ...prev, gold: prev.gold + 1000 }));
        } else if (selectedItem.name.includes('Wood')) {
          setResources(prev => ({ ...prev, wood: prev.wood + 500 }));
        } else if (selectedItem.name.includes('Stone')) {
          setResources(prev => ({ ...prev, stone: prev.stone + 300 }));
        }
      }

      Alert.alert('Purchase Successful', `You bought ${selectedItem.name}!`);
    } else if (selectedItem.currency === 'real') {
      Alert.alert('Premium Purchase', 'This would redirect to payment processing in a real app.');
    }

    setShowPurchaseModal(false);
  };

  const handleGemPurchase = () => {
    Alert.alert('Buy Gems', 'This would redirect to gem purchase in a real app.');
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
          <TouchableOpacity
            style={styles.buyGemsButton}
            onPress={handleGemPurchase}
          >
            <Icon name="add" size={16} color="#D4AF37" />
            <Text style={styles.buyGemsText}>Buy Gems</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategory
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Icon 
                  name={category.icon} 
                  size={20} 
                  color={selectedCategory === category.id ? '#2C1810' : '#D4AF37'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Shop Items</Text>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => handlePurchase(item)}
            >
              <View style={styles.itemHeader}>
                <Icon name={item.icon} size={30} color={item.color} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>
                    {item.currency === 'real' ? `$${item.price}` : item.price}
                  </Text>
                  <Text style={styles.currencyText}>
                    {item.currency === 'real' ? 'USD' : item.currency === 'gems' ? 'Gems' : 'Gold'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dailyDealsContainer}>
          <Text style={styles.sectionTitle}>Daily Deals</Text>
          <View style={styles.dealCard}>
            <View style={styles.dealHeader}>
              <Icon name="local-fire-department" size={24} color="#FF4500" />
              <Text style={styles.dealTitle}>50% OFF</Text>
            </View>
            <Text style={styles.dealText}>All resource packs are 50% off today!</Text>
            <Text style={styles.dealTime}>Offer expires in 23:45:12</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showPurchaseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Icon name={selectedItem.icon} size={40} color={selectedItem.color} />
                  <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                </View>
                
                <Text style={styles.modalDescription}>{selectedItem.description}</Text>
                
                <View style={styles.priceInfo}>
                  <Text style={styles.priceLabel}>Price:</Text>
                  <Text style={styles.priceValue}>
                    {selectedItem.currency === 'real' 
                      ? `$${selectedItem.price}` 
                      : `${selectedItem.price} ${selectedItem.currency}`
                    }
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.purchaseButton}
                    onPress={confirmPurchase}
                  >
                    <Text style={styles.purchaseButtonText}>
                      {selectedItem.currency === 'real' ? 'Buy Now' : 'Purchase'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowPurchaseModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  buyGemsButton: {
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
  buyGemsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  selectedCategory: {
    backgroundColor: '#D4AF37',
  },
  categoryText: {
    color: '#D4AF37',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedCategoryText: {
    color: '#2C1810',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemsContainer: {
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#8B4513',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  currencyText: {
    fontSize: 12,
    color: '#8B4513',
  },
  dailyDealsContainer: {
    marginBottom: 20,
  },
  dealCard: {
    backgroundColor: 'rgba(255, 69, 0, 0.2)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF4500',
  },
  dealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4500',
    marginLeft: 10,
  },
  dealText: {
    fontSize: 16,
    color: '#D4AF37',
    marginBottom: 5,
  },
  dealTime: {
    fontSize: 14,
    color: '#8B4513',
    fontStyle: 'italic',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  purchaseButton: {
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  purchaseButtonText: {
    color: '#2C1810',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});