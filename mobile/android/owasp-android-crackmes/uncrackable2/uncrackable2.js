function rootChecks(){
    // Root checks bypass
    var rootCheckClass = Java.use("sg.vantagepoint.a.b");

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
}

function debugChecks() {
    // Debug checks bypass
    var debugCheckClass = Java.use("sg.vantagepoint.a.a");
    debugCheckClass.a.implementation = function() {
        console.log("Debug check bypassed!");
        return false;
    }

    var DebugClass = Java.use("android.os.Debug");
    DebugClass.isDebuggerConnected.implementation = function() {
        console.log("Debug check bypassed!");
        return false;
    }
}

function removeSystemClock() {
    var SystemClock = Java.use("android.os.SystemClock");
    SystemClock.sleep.implementation = function(sleepTime) {
        // Avoid constant calls to the sleep method
        this.sleep(1000000000);
    }
}

function bypassNativeCheck() {
    // Solution 1: Make the method that calls the native method return true
    var CodeCheck = Java.use("sg.vantagepoint.uncrackable2.CodeCheck");
    CodeCheck.a.implementation = function(str) {
        return true;
    }
}


Java.perform(function(){
    rootChecks();
    debugChecks();
    removeSystemClock();
    
    bypassNativeCheck();
});