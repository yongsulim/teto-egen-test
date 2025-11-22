package com.teto.egen.test;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;
import java.util.Arrays;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register our custom plugins
        registerPlugin(AdMobPlugin.class);

        // Initialize the Mobile Ads SDK.
        MobileAds.initialize(this, initializationStatus -> {});

        // Set a test device configuration. This should only be done for debug builds.
        if (BuildConfig.DEBUG) {
            RequestConfiguration requestConfiguration = new RequestConfiguration.Builder()
                    .setTestDeviceIds(Arrays.asList("YOUR_TEST_DEVICE_ID"))
                    .build();
            MobileAds.setRequestConfiguration(requestConfiguration);
        }
    }
}





