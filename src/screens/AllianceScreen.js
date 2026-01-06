import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export default function AllianceScreen() {
  const [userAlliance, setUserAlliance] = useState(null);
  const [alliances, setAlliances] = useState([
    {
      id: 1,
      name: 'Dragon Knights',
      level: 15,
      members: 45,
      maxMembers: 50,
      description: 'Elite warriors defending the realm',
      requirements: { level: 10, power: 5000 },
      isPublic: true
    },
    {
      id: 2,
      name: 'Shadow Assassins',
      level: 12,
      members: 38,
      maxMembers: 50,
      description: 'Stealth and precision in battle',
      requirements: { level: 8, power: 3000 },
      isPublic: true
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAllianceName, setNewAllianceName] = useState('');
  const [newAllianceDesc, setNewAllianceDesc] = useState('');
  const [userLevel, setUserLevel] = useState(5);
  const [userPower, setUserPower] = useState(2500);

  const handleCreateAlliance = () => {
    if (!newAllianceName.trim()) {
      Alert.alert('Error', 'Please enter an alliance name.');
      return;
    }

    const newAlliance = {
      id: Date.now(),
      name: newAllianceName,
      level: 1,
      members: 1,
      maxMembers: 20,
      description: newAllianceDesc,
      requirements: { level: 1, power: 0 },
      isPublic: true,
      isOwner: true
    };

    setUserAlliance(newAlliance);
    setShowCreateModal(false);
    setNewAllianceName('');
    setNewAllianceDesc('');
    Alert.alert('Success', 'Alliance created successfully!');
  };

  const handleJoinAlliance = (alliance) => {
    if (userLevel < alliance.requirements.level) {
      Alert.alert('Requirements Not Met', `You need to be level ${alliance.requirements.level} to join.`);
      return;
    }

    if (userPower < alliance.requirements.power) {
      Alert.alert('Requirements Not Met', `You need ${alliance.requirements.power} power to join.`);
      return;
    }

    if (alliance.members >= alliance.maxMembers) {
      Alert.alert('Alliance Full', 'This alliance is full.');
      return;
    }

    setUserAlliance(alliance);
    Alert.alert('Success', `You joined ${alliance.name}!`);
  };

  const handleLeaveAlliance = () => {
    Alert.alert(
      'Leave Alliance',
      'Are you sure you want to leave this alliance?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive',
          onPress: () => {
            setUserAlliance(null);
            Alert.alert('Left Alliance', 'You have left the alliance.');
          }
        }
      ]
    );
  };

  const handleAllianceWar = () => {
    if (!userAlliance) {
      Alert.alert('No Alliance', 'You must be in an alliance to participate in wars.');
      return;
    }

    Alert.alert('Alliance War', 'Alliance wars feature coming soon!');
  };

  const handleAllianceChat = () => {
    if (!userAlliance) {
      Alert.alert('No Alliance', 'You must be in an alliance to use chat.');
      return;
    }

    Alert.alert('Alliance Chat', 'Chat feature coming soon!');
  };

  return (
    <LinearGradient colors={['#2C1810', '#8B4513']} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Icon name="trending-up" size={20} color="#D4AF37" />
              <Text style={styles.statText}>Level: {userLevel}</Text>
            </View>
            <View style={styles.statItem}>
              <Icon name="sports-swords" size={20} color="#D4AF37" />
              <Text style={styles.statText}>Power: {userPower}</Text>
            </View>
          </View>
        </View>

        {userAlliance ? (
          <View style={styles.currentAllianceContainer}>
            <Text style={styles.sectionTitle}>Your Alliance</Text>
            <View style={styles.allianceCard}>
              <View style={styles.allianceHeader}>
                <Icon name="group" size={30} color="#D4AF37" />
                <View style={styles.allianceInfo}>
                  <Text style={styles.allianceName}>{userAlliance.name}</Text>
                  <Text style={styles.allianceLevel}>Level {userAlliance.level}</Text>
                </View>
                {userAlliance.isOwner && (
                  <Icon name="star" size={20} color="#FFD700" />
                )}
              </View>
              
              <Text style={styles.allianceDescription}>{userAlliance.description}</Text>
              
              <View style={styles.allianceStats}>
                <Text style={styles.allianceStat}>Members: {userAlliance.members}/{userAlliance.maxMembers}</Text>
                <Text style={styles.allianceStat}>Level: {userAlliance.level}</Text>
              </View>

              <View style={styles.allianceActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleAllianceChat}
                >
                  <Icon name="chat" size={16} color="#D4AF37" />
                  <Text style={styles.actionButtonText}>Chat</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleAllianceWar}
                >
                  <Icon name="sports-swords" size={16} color="#D4AF37" />
                  <Text style={styles.actionButtonText}>War</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.leaveButton}
                  onPress={handleLeaveAlliance}
                >
                  <Icon name="exit-to-app" size={16} color="#DC143C" />
                  <Text style={styles.leaveButtonText}>Leave</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.noAllianceContainer}>
            <Text style={styles.sectionTitle}>Join an Alliance</Text>
            <Text style={styles.noAllianceText}>
              Join an alliance to participate in wars, chat with other players, and get alliance bonuses!
            </Text>
            
            <View style={styles.allianceActions}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => Alert.alert('Join Alliance', 'Alliance joining feature coming soon!')}
              >
                <Icon name="group-add" size={20} color="#2C1810" />
                <Text style={styles.primaryButtonText}>Join Alliance</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Icon name="add" size={20} color="#D4AF37" />
                <Text style={styles.secondaryButtonText}>Create Alliance</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.availableAlliancesContainer}>
          <Text style={styles.sectionTitle}>Available Alliances</Text>
          {alliances.map((alliance) => (
            <View key={alliance.id} style={styles.allianceCard}>
              <View style={styles.allianceHeader}>
                <Icon name="group" size={24} color="#D4AF37" />
                <View style={styles.allianceInfo}>
                  <Text style={styles.allianceName}>{alliance.name}</Text>
                  <Text style={styles.allianceLevel}>Level {alliance.level}</Text>
                </View>
                <View style={styles.allianceStatus}>
                  <Text style={styles.memberCount}>
                    {alliance.members}/{alliance.maxMembers}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.allianceDescription}>{alliance.description}</Text>
              
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Requirements:</Text>
                <Text style={styles.requirementText}>
                  Level {alliance.requirements.level} • Power {alliance.requirements.power}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.joinButton,
                  (userLevel < alliance.requirements.level || 
                   userPower < alliance.requirements.power ||
                   alliance.members >= alliance.maxMembers) && styles.disabledButton
                ]}
                onPress={() => handleJoinAlliance(alliance)}
                disabled={userLevel < alliance.requirements.level || 
                          userPower < alliance.requirements.power ||
                          alliance.members >= alliance.maxMembers}
              >
                <Text style={styles.joinButtonText}>
                  {alliance.members >= alliance.maxMembers ? 'Full' : 'Join'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Alliance</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Alliance Name"
              value={newAllianceName}
              onChangeText={setNewAllianceName}
              placeholderTextColor="#8B4513"
            />
            
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Description (Optional)"
              value={newAllianceDesc}
              onChangeText={setNewAllianceDesc}
              placeholderTextColor="#8B4513"
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateAlliance}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsGrid: {
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
  currentAllianceContainer: {
    marginBottom: 20,
  },
  noAllianceContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  noAllianceText: {
    color: '#8B4513',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  allianceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    margin: 5,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#2C1810',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    margin: 5,
  },
  secondaryButtonText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  availableAlliancesContainer: {
    marginBottom: 20,
  },
  allianceCard: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  allianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  allianceInfo: {
    flex: 1,
    marginLeft: 10,
  },
  allianceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  allianceLevel: {
    fontSize: 14,
    color: '#8B4513',
  },
  allianceStatus: {
    alignItems: 'flex-end',
  },
  memberCount: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  allianceDescription: {
    color: '#8B4513',
    marginBottom: 10,
    lineHeight: 18,
  },
  allianceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  allianceStat: {
    color: '#D4AF37',
    fontSize: 14,
  },
  requirementsContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  requirementsTitle: {
    color: '#D4AF37',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  requirementText: {
    color: '#8B4513',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    margin: 2,
  },
  actionButtonText: {
    color: '#D4AF37',
    marginLeft: 5,
    fontSize: 12,
  },
  leaveButton: {
    backgroundColor: 'rgba(220, 20, 60, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    margin: 2,
  },
  leaveButtonText: {
    color: '#DC143C',
    marginLeft: 5,
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: '#D4AF37',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#2C1810',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#696969',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D4AF37',
    textAlign: 'center',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: '#8B4513',
    borderRadius: 8,
    padding: 12,
    color: '#D4AF37',
    marginBottom: 15,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  createButton: {
    backgroundColor: '#D4AF37',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  createButtonText: {
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