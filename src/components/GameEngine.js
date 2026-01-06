import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import TowerSystem from './TowerSystem';
import EnemySystem from './EnemySystem';
import ProjectileSystem from './ProjectileSystem';

const { width, height } = Dimensions.get('window');

const GameEngineComponent = forwardRef(({ 
  gameState, 
  onTowerPlacement, 
  onEnemyReachEnd, 
  onWaveComplete 
}, ref) => {
  const gameEngineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    start: () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.start();
      }
    },
    stop: () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
      }
    }
  }));

  const entities = {
    // Game systems
    towerSystem: {
      type: 'towerSystem',
      towers: gameState.towers,
      onTowerPlacement: onTowerPlacement
    },
    enemySystem: {
      type: 'enemySystem',
      enemies: gameState.enemies,
      onEnemyReachEnd: onEnemyReachEnd,
      onWaveComplete: onWaveComplete
    },
    projectileSystem: {
      type: 'projectileSystem',
      projectiles: []
    }
  };

  return (
    <View style={styles.gameArea}>
      <GameEngine
        ref={gameEngineRef}
        systems={[TowerSystem, EnemySystem, ProjectileSystem]}
        entities={entities}
        running={true}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});

export default GameEngineComponent;