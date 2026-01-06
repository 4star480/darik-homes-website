import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartGame = () => {
    navigation.navigate('MainGame');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings feature coming soon!');
  };

  return (
    <LinearGradient
      colors={['#2C1810', '#8B4513', '#D4AF37']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Icon name="sports-swords" size={80} color="#D4AF37" />
          <Text style={styles.gameTitle}>KINGSHOT</Text>
          <Text style={styles.gameSubtitle}>Medieval Kingdom Defense</Text>
        </View>

        <View style={styles.resourceContainer}>
          <View style={styles.resourceItem}>
            <Icon name="monetization-on" size={20} color="#FFD700" />
            <Text style={styles.resourceText}>1000 Gold</Text>
          </View>
          <View style={styles.resourceItem}>
            <Icon name="eco" size={20} color="#8B4513" />
            <Text style={styles.resourceText}>500 Wood</Text>
          </View>
          <View style={styles.resourceItem}>
            <Icon name="terrain" size={20} color="#696969" />
            <Text style={styles.resourceText}>300 Stone</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleStartGame}
          >
            <Icon name="play-arrow" size={24} color="#2C1810" />
            <Text style={styles.primaryButtonText}>Enter Kingdom</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSettings}
          >
            <Icon name="settings" size={20} color="#D4AF37" />
            <Text style={styles.secondaryButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Game Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="home" size={16} color="#D4AF37" />
              <Text style={styles.featureText}>Kingdom Building</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="sports-swords" size={16} color="#D4AF37" />
              <Text style={styles.featureText}>Tower Defense</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="person" size={16} color="#D4AF37" />
              <Text style={styles.featureText}>Hero Collection</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="group" size={16} color="#D4AF37" />
              <Text style={styles.featureText}>Alliance System</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  gameTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gameSubtitle: {
    fontSize: 16,
    color: '#8B4513',
    marginTop: 5,
    fontStyle: 'italic',
  },
  resourceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceText: {
    color: '#D4AF37',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  menuContainer: {
    width: '100%',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: '#2C1810',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  secondaryButtonText: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    margin: 4,
    borderRadius: 15,
  },
  featureText: {
    color: '#D4AF37',
    marginLeft: 5,
    fontSize: 12,
  },
});