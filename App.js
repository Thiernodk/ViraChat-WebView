import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Pages simples sans WebView
const ChatsPage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.content}>
      <Text style={styles.pageTitle}>Messages</Text>
      
      <View style={styles.chatItem}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={24} color="#ffffff" />
        </View>
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>Sarah Jenkins</Text>
          <Text style={styles.chatMessage}>Les projections Q3 sont prometteuses...</Text>
          <Text style={styles.chatTime}>15:30</Text>
        </View>
      </View>
      
      <View style={styles.chatItem}>
        <View style={styles.avatar}>
          <MaterialIcons name="group" size={24} color="#ffffff" />
        </View>
        <View style={styles.chatContent}>
          <Text style={styles.chatName}>Équipe Marketing</Text>
          <Text style={styles.chatMessage}>Réunion de stratégie à 16h</Text>
          <Text style={styles.chatTime}>14:20</Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const CallsPage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.content}>
      <Text style={styles.pageTitle}>Appels</Text>
      
      <View style={styles.callItem}>
        <MaterialIcons name="phone" size={24} color="#0a0f97ffff" />
        <View style={styles.callContent}>
          <Text style={styles.callName}>David Chen</Text>
          <Text style={styles.callType}>Appel entrant - 12:45</Text>
          <Text style={styles.callDuration}>5:23</Text>
        </View>
      </View>
      
      <View style={styles.callItem}>
        <MaterialIcons name="videocam" size={24} color="#212cfaff" />
        <View style={styles.callContent}>
          <Text style={styles.callName}>Réunion Q3</Text>
          <Text style={styles.callType}>Visioconférence - 10:30</Text>
          <Text style={styles.callDuration}>45:12</Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const MeetingsPage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.content}>
      <Text style={styles.pageTitle}>Réunions</Text>
      
      <View style={styles.meetingItem}>
        <View style={styles.meetingTime}>
          <Text style={styles.timeText}>09:00</Text>
        </View>
        <View style={styles.meetingContent}>
          <Text style={styles.meetingTitle}>Comité Exécutif</Text>
          <Text style={styles.meetingDesc}>Revue roadmap stratégique</Text>
          <View style={styles.participants}>
            <MaterialIcons name="people" size={16} color="#666" />
            <Text style={styles.participantCount}>8 participants</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.meetingItem}>
        <View style={styles.meetingTime}>
          <Text style={styles.timeText}>14:00</Text>
        </View>
        <View style={styles.meetingContent}>
          <Text style={styles.meetingTitle}>Marketing</Text>
          <Text style={styles.meetingDesc}>Campagne Q4</Text>
          <View style={styles.participants}>
            <MaterialIcons name="people" size={16} color="#666" />
            <Text style={styles.participantCount}>5 participants</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const ProfilePage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView style={styles.content}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <MaterialIcons name="person" size={48} color="#ffffff" />
        </View>
        <Text style={styles.profileName}>Jean Dupont</Text>
        <Text style={styles.profileTitle}>Directeur Technique</Text>
        <View style={styles.status}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>En ligne</Text>
        </View>
      </View>
      
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={20} color="#666" />
          <Text style={styles.infoText}>jean.dupont@opportun.com</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="phone" size={20} color="#666" />
          <Text style={styles.infoText}>+33 1 23 45 67 89</Text>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Chats') {
              iconName = focused ? 'chat' : 'chat';
            } else if (route.name === 'Calls') {
              iconName = focused ? 'call' : 'call';
            } else if (route.name === 'Meetings') {
              iconName = focused ? 'video-call' : 'video-call';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person';
            }

            return <MaterialIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2142ffff',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e5e5e5',
          },
          headerStyle: {
            backgroundColor: '#000f22',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomePage}
          options={{ title: 'Opportun' }}
        />
        <Tab.Screen 
          name="Chats" 
          component={ChatsPage}
          options={{ title: 'Messages' }}
        />
        <Tab.Screen 
          name="Calls" 
          component={CallsPage}
          options={{ title: 'Appels' }}
        />
        <Tab.Screen 
          name="Meetings" 
          component={MeetingsPage}
          options={{ title: 'Réunions' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfilePage}
          options={{ title: 'Profil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000f22',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000f22',
    marginLeft: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000f22',
    marginBottom: 24,
  },
  chatItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#212fffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000f22',
  },
  chatMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chatTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  callItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  callContent: {
    flex: 1,
    marginLeft: 12,
  },
  callName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000f22',
  },
  callType: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  callDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  meetingItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  meetingTime: {
    marginRight: 16,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#214effff',
  },
  meetingContent: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000f22',
  },
  meetingDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  participantCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  profileAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2121ffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000f22',
  },
  profileTitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ff00',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#006d37',
  },
  profileSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000f22',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
});
