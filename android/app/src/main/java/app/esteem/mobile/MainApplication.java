package app.esteem.mobile;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.entria.views.RNViewOverflowPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNViewOverflowPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
            new ReactNativeRestartPackage(),
            new LinearGradientPackage(),
            new FastImageViewPackage(),
            new ReactNativeConfigPackage(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
