import { registerPlugin } from '@capacitor/core';

const AdMob = registerPlugin('AdMob');

export const loadInterstitial = async () => {
  try {
    await AdMob.loadInterstitialAd();
    console.log('Interstitial Ad loaded successfully');
  } catch (error) {
    console.error('Failed to load Interstitial Ad:', error);
  }
};

export const showInterstitial = async () => {
  try {
    await AdMob.showInterstitialAd();
    console.log('Interstitial Ad shown successfully');
  } catch (error) {
    console.error('Failed to show Interstitial Ad:', error);
  }
};
