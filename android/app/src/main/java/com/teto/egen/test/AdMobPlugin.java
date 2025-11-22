package com.teto.egen.test;

import android.util.Log;
import androidx.annotation.NonNull;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

@CapacitorPlugin(name = "AdMob")
public class AdMobPlugin extends Plugin {

    private InterstitialAd mInterstitialAd;

    @PluginMethod
    public void loadInterstitialAd(PluginCall call) {
        String adUnitId = "ca-app-pub-9471537431449262/6971107188";
        AdRequest adRequest = new AdRequest.Builder().build();

        getActivity().runOnUiThread(() -> InterstitialAd.load(getContext(), adUnitId, adRequest, new InterstitialAdLoadCallback() {
            @Override
            public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
                mInterstitialAd = interstitialAd;
                Log.d("AdMobPlugin", "Interstitial ad loaded.");
                call.resolve();
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                Log.d("AdMobPlugin", "Interstitial ad failed to load: " + loadAdError.getMessage());
                mInterstitialAd = null;
                call.reject("Failed to load interstitial ad: " + loadAdError.getMessage());
            }
        }));
    }

    @PluginMethod
    public void showInterstitialAd(PluginCall call) {
        if (mInterstitialAd != null) {
            getActivity().runOnUiThread(() -> {
                mInterstitialAd.show(getActivity());
                call.resolve();
            });
        } else {
            Log.d("AdMobPlugin", "Interstitial ad was not ready to be shown.");
            call.reject("Interstitial ad not ready.");
        }
    }
}
