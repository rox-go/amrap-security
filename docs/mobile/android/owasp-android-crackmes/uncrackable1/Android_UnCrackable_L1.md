# Android UnCrackable L1

Once launched the application displays the following view warning users that the device is rooted:

![image](media/Android_UnCrackable_L1_1.png)


So let's check its source code. To do so we will need to decompile its source code with [JADX](https://github.com/skylot/jadx). This can be run from the command line with the following command:

```bash
jadx-gui UnCrackable-Level1.apk
```

Once loaded, we navigate to the application's launcher class `MainActivity.class`. Checking its code it is confirmed that the application not only checks if it's being run on a rooted device, but it also checks if the app is running in debug mode:

![image](media/Android_UnCrackable_L1_2.png)

So, to bypass these controls, we will have to hook all these methods with Frida and make them return `false`:

![image](media/Android_UnCrackable_L1_3.png)


![image](media/Android_UnCrackable_L1_4.png)

The Frida script to bypass these checks will look like:

```javascript
Java.perform(function(){
    
    // Root checks bypass
    var rootCheckClass = Java.use("sg.vantagepoint.a.c");

    rootCheckClass.a.implementation = function(){
        console.log("Root check bypassed!");
        return false;
    }

    rootCheckClass.b.implementation = function(){
        console.log("Root check bypassed!");
        return false;
    }

    rootCheckClass.c.implementation = function(){
        console.log("Root check bypassed!");
        return false;
    }

    // Debug checks bypass
    var debugCheck = Java.use("sg.vantagepoint.a.b");
    debugCheck.a.implementation = function() {
        console.log("Debug check bypassed!");
        return false;
    }
});
```