import { Plugins } from '@capacitor/core';

const { AdMobPlugin } = Plugins;

export const loadInterstitial = async () => {
  try {
    await AdMobPlugin.loadInterstitialAd();
    console.log('Interstitial Ad loaded successfully');
  } catch (error) {
    console.error('Failed to load Interstitial Ad:', error);
  }
};

export const showInterstitial = async () => {
  try {
    await AdMobPlugin.showInterstitialAd();
    console.log('Interstitial Ad shown successfully');
  } catch (error) {
    console.error('Failed to show Interstitial Ad:', error);
  }
};
