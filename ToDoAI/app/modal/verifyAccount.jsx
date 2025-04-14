import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useGlobalContext } from '../context/GlobalProvider';

export default function VerifyAccount() {
    const { user, setUser } = useGlobalContext();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {

        axios.put('https://54ea-109-245-193-150.ngrok-free.app/verify', {
            email: user.email,
            verificationCode: verificationCode
        })
        .then((response) => {
            console.log(response.data);
            AsyncStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
            router.back();
            router.push('/main/TimelineView');
        })
        .catch((error) => {
            Alert.alert('Error', 'Failed to verify account. Please try again.');
        })


    } catch (error) {
      Alert.alert('Error', 'Failed to verify account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      
      {/* Close button */}
      <TouchableOpacity 
        className="absolute top-12 right-6 z-10" 
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="#333" />
      </TouchableOpacity>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center"
      >
        <Animated.View 
          className="px-6"
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="mail-outline" size={32} color="#333" />
            </View>
            <Text className="text-gray-900 text-2xl font-bold mb-2">
              Verify Your Account
            </Text>
            <Text className="text-gray-600 text-center">
              We've sent a verification code to your email address
            </Text>
          </View>

          {/* Code Input */}
          <View className="flex-row justify-between mb-8">
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => inputRefs.current[index] = ref}
                className="w-12 h-12 bg-gray-100 rounded-lg text-center text-xl font-semibold"
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
                contextMenuHidden
              />
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity 
            className={`bg-gray-900 py-4 rounded-full mb-6 ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center justify-center">
                <View className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <Text className="text-white text-center text-base font-semibold">
                  Verifying...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-center text-base font-semibold">
                Verify Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Resend Code */}
          <TouchableOpacity 
            className="mb-8"
            onPress={() => {
              // Implement resend code functionality
              Alert.alert('Success', 'Verification code has been resent');
            }}
          >
            <Text className="text-gray-600 text-center">
              Didn't receive the code? <Text className="text-gray-900 font-semibold">Resend</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
