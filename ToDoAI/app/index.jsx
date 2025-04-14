import { View, Text, TouchableOpacity, SafeAreaView, Animated, Image, Dimensions, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

// Get screen dimensions for responsive sizing
const { width, height } = Dimensions.get('window');

// Import logo for loading screen
const logoImage = require('../assets/logo.png');

// Import video at top level
const videoFile = require('../assets/aassdd.mp4');

// Updated icons using Ionicons
const ChartIcon = () => (
  <Ionicons name="analytics-outline" size={22} color="#fff" />
);

const AnalyticsIcon = () => (
  <Ionicons name="bar-chart-outline" size={22} color="#fff" />
);

const PersonalizedIcon = () => (
  <Ionicons name="sparkles-outline" size={22} color="#fff" />
);

export default function WelcomePage() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [hasPhoto, setHasPhoto] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const loadingFadeAnim = useRef(new Animated.Value(1)).current;
  const photoSource = null;
  const videoRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState({});

  useEffect(() => {
    checkUser();
    
    // Preload the GIF image
    const preloadImages = async () => {
      try {
        // No need to prefetch local assets but keeping for future remote URLs
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };
    
    preloadImages();
    
    // Show loading screen for 1.5 seconds
    setTimeout(() => {
      Animated.timing(loadingFadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowLoading(false);
        // Start welcome screen animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 1500);
  }, []);

  // Function to handle video loading
  const handleVideoLoad = (status) => {
    console.log('Video loaded with status:', status);
    if (!status.isLoaded) {
      console.error('Video failed to load properly');
    }
  };
  
  // Function to play video
  const playVideo = async () => {
    if (videoRef.current) {
      try {
        const status = await videoRef.current.getStatusAsync();
        console.log('Current video status:', status);
        
        if (status.isLoaded) {
          console.log('Playing video');
          await videoRef.current.playAsync();
        } else {
        }
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  };
  
  // Handle GIF loading completion
  const handleGifLoad = () => {
    console.log('GIF loaded successfully');
  };
  
  // Add effect to play video when loading completes
  useEffect(() => {
    if (!showLoading && videoRef.current) {
      playVideo();
    }
  }, [showLoading]);

  const checkUser = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        // User exists, route to home
        router.replace('/main/TimelineView');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      {/* Loading Screen */}
      {showLoading && (
        <Animated.View 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: loadingFadeAnim,
            zIndex: 1
          }}
        >
          <View className="items-center">
            <Text style={{
              fontSize: 42,
              fontWeight: '600',
              marginBottom: 10,
              color: '#333',
              letterSpacing: 0,
              fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
            }}>
              SimpleDay
            </Text>
            <View style={{ height: 2, width: 30, backgroundColor: '#333', marginBottom: 10 }} />
          </View>
        </Animated.View>
      )}
      
      {/* Welcome Content */}
      <Animated.View 
        className="flex-1 px-6 justify-between"
        style={{ 
          opacity: fadeAnim, 
          transform: [{ translateY: slideAnim }],
          display: showLoading ? 'none' : 'flex'
        }}
      >
        {/* Photo Section - Will be empty if no photo */}
        <View className="items-center mt-12 mb-4">
          {hasPhoto ? (
            <Image
              source={photoSource}
              style={{
                width: width * 0.85,
                height: width * 1.2,
                borderRadius: 20,
              }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ 
              width: width * 1, 
              height: width * 1,
              alignSelf: 'center',
              borderRadius: 20,
              backgroundColor: 'white',
              marginVertical: 10
            }}>
              <Video
                ref={videoRef}
                source={videoFile}
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                }}
                resizeMode="contain"
                shouldPlay={true}
                isLooping={true}
                useNativeControls={false}
                isMuted={false}
                onLoad={handleVideoLoad}
                onError={(error) => console.error('Video error:', error)}
              />
            </View>
          )}
        </View>

        {/* Bottom Section - Welcome Text and Buttons */}
        <View className="w-full items-center mb-10">
          <Text className="text-gray-900 text-4xl font-bold mb-3 text-center">
            SimpleDay
          </Text>
          
          <Text className="text-gray-700 text-center text-lg mb-10">
            Organize your day with AI-powered task management. Simple, intuitive, and efficient.
          </Text>
          
          <Link href="/modal/signup" asChild>
            <TouchableOpacity 
              className="bg-gray-900 w-full py-4 rounded-full mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Get Started
              </Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/modal/signin" asChild>
            <TouchableOpacity>
              <Text className="text-gray-500 text-center text-base">
                Already have an account?
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
const FeatureItem = ({ icon, title, description }) => (
  <View className="flex-row items-start space-x-4">
    <View className="bg-zinc-800 w-10 h-10 rounded-lg items-center justify-center">
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-base font-medium text-white mb-1">{title}</Text>
      <Text className="text-zinc-400 text-sm">{description}</Text>
    </View>
  </View>
);

