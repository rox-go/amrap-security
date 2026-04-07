function rootChecks(){
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
}

function debugChecks() {
    // Debug checks bypass
    var debugCheckClass = Java.use("sg.vantagepoint.a.b");
    debugCheckClass.a.implementation = function() {
        console.log("Debug check bypassed!");
        return false;
    }
}

function extractSecretKey(){
    var decryptClass = Java.use("sg.vantagepoint.a.a")
    decryptClass.a.implementation = function (bArr1, bArr2) {
        // Let the original method finish and get the byte array
        var retValue = this.a(bArr1, bArr2);

        // Since the decryption method returns a byte array, we need to cast it to a String object
        var stringClass = Java.use("java.lang.String");
        var decryptedString = stringClass.$new(retValue);
        console.log("Secret: " + decryptedString);
        
        // IMPORTANT: Return the original byte array so the app keeps working
        return retValue;
    }
}

Java.perform(function(){
    rootChecks();
    debugChecks();
    extractSecretKey();
});