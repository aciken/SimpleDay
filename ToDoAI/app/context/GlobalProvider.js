import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';


const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const setupPurchases = async () => {
            try {
                if(Platform.OS === 'ios') {
                    await Purchases.configure({ apiKey: 'appl_GRLdVasEJsaYcJYIpxnrohytjZJ'});
                } else {
                    await Purchases.configure({ apiKey: 'appl_GRLdVasEJsaYcJYIpxnrohytjZJ' });
                }

                const id = await JSON.parse(await AsyncStorage.getItem('user'))._id;

                const customerInfo = await Purchases.getCustomerInfo();
                const currentRevenueCatId = await Purchases.getAppUserID();
                const isPro = customerInfo.entitlements.all.Pro?.isActive;

                console.log(currentRevenueCatId);

                setIsPro(customerInfo.entitlements.all.Pro?.isActive ?? false);

                

                if(id) {
                    await Purchases.logIn(id);
                    console.log('Logged in to RevenueCat with ID:', id);
                  }

                  if(isPro && currentRevenueCatId !== id) {
                    console.log('diff', currentRevenueCatId, id, isPro)
                    if(id) {

                        await Purchases.logIn(id);
                        setIsPro(false);
                    }
                  }


            } catch (error) {
                console.error('Error setting up purchases:', error);
            }
        };



        setupPurchases();
    }, [user]);

    useEffect(() => {
        console.log(isPro);
        console.log(Purchases.getCustomerInfo());
    }, [isPro]);


    

    useEffect(() => {
        const fetchUser = async () => {
            const user = await AsyncStorage.getItem('user');
            setUser(user);
        }
        fetchUser();
    }, []);


    
    useEffect(() => {
        if (error) {
            console.log(error);
        }
    }, [error]);
    
    
    

    return (
        <GlobalContext.Provider
         value={{ 
            user,
            setUser,
            isAuthenticated,
            setIsAuthenticated,
            isLoading,
            setIsLoading,
            error,
            setError,
            isPro,
            setIsPro }}>
            {children}
        </GlobalContext.Provider>
    )


}

