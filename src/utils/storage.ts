import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  THEME: '@taskmaster_theme',
  SESSION_TOKEN: '@taskmaster_session_token',
};

export const saveThemePreference = async (theme: 'light' | 'dark'): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    console.log('Theme preference saved:', theme);
  } catch (error) {
    console.error('Error saving theme preference:', error);
    throw error;
  }
};

export const getThemePreference = async (): Promise<'light' | 'dark'> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as 'light' | 'dark') || 'light';
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return 'light';
  }
};

export const saveSessionToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
    console.log('Session token saved');
  } catch (error) {
    console.error('Error saving session token:', error);
    throw error;
  }
};

export const getSessionToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting session token:', error);
    return null;
  }
};

export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('All storage cleared');
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};