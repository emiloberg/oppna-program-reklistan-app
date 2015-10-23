# oppna-program-reklistan-app

iOS and Android app to help medical professionals in Region Västra Götaland, Sweden, to prescribe drugs. 

It fetches data via JSON from the companion website [http://reklistan.vgregion.se](http://reklistan.vgregion.se) and stores in the app for offline usage. Built with [NativeScript](https://www.nativescript.org/). The backend site which supplies the data is built with [Liferay](https://www.liferay.com/).

[![Screenshot of YouTube video](https://raw.githubusercontent.com/emiloberg/oppna-program-reklistan-app/35e55b55a632632e430ec191ff9cc030b4058b6a/docs/youtube-screenshot.png)](https://www.youtube.com/watch?v=9GeqZmPBxm4)

[Watch video demonstration (43 seconds)](https://www.youtube.com/watch?v=9GeqZmPBxm4)

## Installation

```
# Clone this repo
git clone https://github.com/emiloberg/oppna-program-reklistan-app.git

# Install Dev dependencies (gulp etc)
npm install

# Check that you have gulp installed
gulp -v

# Install gulp if it wasn't installed
npm install gulp -g

# Generate images of different resoultions from source files
gulp images

# Build ES6 > ES5
gulp _compile

# Cd to the actual app dir
cd rekapp

# Install App Dependencies
npm install

# Add iOS and Android Platforms
tns platform add ios
tns platform add android

## cd back to the root dir
cd ..

## Copy iOS/Android app settings files to the platforms folders.
cp ./resources/app-settings/AndroidManifest.xml ./rekapp/platforms/android/src/main/
cp ./resources/app-settings/rekapp-Info.plist ./rekapp/platforms/ios/rekapp/

## Follow the instructions under the heading 'Hacks' below.

```

## Hacks

Currently the WebView isn't can't show pre-downloaded images on Android. There's [an open GitHub issue]([https://github.com/NativeScript/NativeScript/issues/963](https://github.com/NativeScript/NativeScript/issues/963)) which solves this. 

In the meantime, after `npm install`, manually patch file `rekapp/node_modules/tns-core-modules/ui/web-view/web-view.android.js` Line 84 and replace

```
this._android.loadData(src, "text/html; charset=utf-8", "utf-8");
```

with

```
var baseUrl = "file:///" + require("file-system").knownFolders.documents().path + '/';
this._android.loadDataWithBaseURL(baseUrl, src, "text/html; charset=utf-8", "utf-8", null);
```

## Development
This is a ES2015/EcmaScript 6 app. All source files lives in the `src` directory and gets compiled into ES5 into the `/rekapp` directory.

Images in vector format in `src/app/images` gets converted into png images of different sizes (@2x, @3x, hdpi, etc) and copied to `rekapp/app/images` when `gulp images` is run. Images, already in png format, in `src/app/images-fixed` just gets copied to `rekapp/app/images` when the same gulp task is run.

### When developing, run:

```
# To start the emulator the first time
gulp startIOS

# To watch for file changes. When a file is changed
# the source is recomipled (from ES2015 to ES5) and 
# changes pushed to the emulator.
gulp livesyncIOS
```

or run:

```
gulp watchFullIOS
```

Currently, NativeScript does unfortunately not display `console.log` or exception statements in the terminal when running with livesync. Therefor we still have to do full rebuilds with the `watchFullIOS` command to get terminal outputs.


### File structure
```
| - gulpfile.js - Development gulp file (for recompiling, etc)
| - node_modules - Development modules
| - package.json - Development package.json
| - rekapp - The actual app.
  | - app - The actual app
  | - node_modules - App modules
  | - package.json - App package json
| - resources - Resources which are not bundled with the app
| - src - Source of the app. Files gets moved from here to 'rekapp'

```

* Javascript source files (ES2015) gets compiled and moved from `src` to `rekapp`. XML and CSS files gets copied without alternation.
* Javascript files in `src/thirdparty` gets moved from `src` to `rekapp` _without_ compilation.
* To install app dependencies, run `npm install [package] --save` from the `rekapp` folder. The NativeScript build process will copy them  to the correct places in the app. They may be required in the normal way (`let theModules = require('theModule')`)



### Changes to app settings
These changes are done to the iOS/Android app settings.

#### Set Android Permissions

Edit: `rekapp/platforms/android/src/main/AndroidManifest.xml` and add:

```
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
```

#### Disable landscape mode and remove Android Title Bar by:

##### Android

Edit: `rekapp/platforms/android/src/main/AndroidManifest.xml` and change

```
<activity
    android:name="com.tns.NativeScriptActivity"
    android:label="@string/title_activity_kimera"
    android:configChanges="keyboardHidden|orientation|screenSize">
```

into 

```
<activity
    android:name="com.tns.NativeScriptActivity"
    android:label="@string/title_activity_kimera"
    android:configChanges="keyboardHidden|orientation|screenSize"
    android:screenOrientation="sensorPortrait"
    android:theme="@android:style/Theme.NoTitleBar.Fullscreen">
```

##### iOS

Edit: `rekapp/platforms/ios/rekapp/rekapp-Info.plist` 

To allow SSL Connections on iOS9+. Add as a child to the outermost `<dict>`:

```
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

To change app name, change:

```
	<key>CFBundleDisplayName</key>
	<string>${PRODUCT_NAME}</string>
```

into 

```
	<key>CFBundleDisplayName</key>
	<string>REKlistan</string>
```

and then, to change allowed orientations, change:

```
<key>UISupportedInterfaceOrientations</key>
<array>
	<string>UIInterfaceOrientationPortrait</string>
	<string>UIInterfaceOrientationLandscapeLeft</string>
	<string>UIInterfaceOrientationLandscapeRight</string>
</array>
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
	<string>UIInterfaceOrientationPortrait</string>
	<string>UIInterfaceOrientationPortraitUpsideDown</string>
	<string>UIInterfaceOrientationLandscapeLeft</string>
	<string>UIInterfaceOrientationLandscapeRight</string>
</array>
```

into 

```
<key>UISupportedInterfaceOrientations</key>
<array>
	<string>UIInterfaceOrientationPortrait</string>
</array>
<key>UISupportedInterfaceOrientations~ipad</key>
<array>
	<string>UIInterfaceOrientationPortrait</string>
	<string>UIInterfaceOrientationPortraitUpsideDown</string>
</array>
```
