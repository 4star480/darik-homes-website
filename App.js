import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Game Screens
import HomeScreen from './src/screens/HomeScreen';
import KingdomScreen from './src/screens/KingdomScreen';
import BattleScreen from './src/screens/BattleScreen';
import HeroesScreen from './src/screens/HeroesScreen';
import AllianceScreen from './src/screens/AllianceScreen';
import ShopScreen from './src/screens/ShopScreen';

// Game Components
import GameEngine from './src/components/GameEngine';
import ResourceManager from './src/managers/ResourceManager';
import HeroManager from './src/managers/HeroManager';
import BuildingManager from './src/managers/BuildingManager';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Kingdom':
              iconName = 'home';
              break;
            case 'Battle':
              iconName = 'sports-swords';
              break;
            case 'Heroes':
              iconName = 'person';
              break;
            case 'Alliance':
              iconName = 'group';
              break;
            case 'Shop':
              iconName = 'store';
              break;
            default:
              iconName = 'home';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B4513',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#2C1810',
          borderTopColor: '#8B4513',
        },
        headerStyle: {
          backgroundColor: '#2C1810',
        },
        headerTintColor: '#D4AF37',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Kingdom" component={KingdomScreen} />
      <Tab.Screen name="Battle" component={BattleScreen} />
      <Tab.Screen name="Heroes" component={HeroesScreen} />
      <Tab.Screen name="Alliance" component={AllianceScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [gameData, setGameData] = useState({
    resources: {
      gold: 1000,
      wood: 500,
      stone: 300,
      food: 200
    },
    level: 1,
    experience: 0,
    heroes: [],
    buildings: [],
    alliance: null
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize game data
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      // Load saved game data
      // Initialize managers
      ResourceManager.initialize(gameData.resources);
      HeroManager.initialize(gameData.heroes);
      BuildingManager.initialize(gameData.buildings);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      Alert.alert('Error', 'Failed to load game data');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Kingshot...</Text>
        <Text style={styles.loadingSubtext}>Preparing your kingdom</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#2C1810" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2C1810',
          },
          headerTintColor: '#D4AF37',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainGame" 
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C1810',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 10,
  },
  loadingSubtext: {
    fontSize: 16,
    color: '#8B4513',
  },
});



