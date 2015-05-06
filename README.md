#nativescript-emulator-reload

This small gulp script will monitor the source files of a [NativeScript](https://www.nativescript.org/) project and when a file is changed it'll rebuild and reload the emulator.

Currently only supports iOS emulators.

## Install
```
cd /your/project/root
npm install nativescript-emulator-reload
```

## Run
```
gulp
```

or with a device flag:

```
gulp -d iPad-Retina
```

list valid devices with `gulp help`

