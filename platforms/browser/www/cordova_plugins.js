cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/uk.co.ilee.shake/www/shake.js",
        "id": "uk.co.ilee.shake.Shake",
        "clobbers": [
            "shake"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/Acceleration.js",
        "id": "org.apache.cordova.device-motion.Acceleration",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/accelerometer.js",
        "id": "org.apache.cordova.device-motion.accelerometer",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/src/browser/AccelerometerProxy.js",
        "id": "org.apache.cordova.device-motion.AccelerometerProxy",
        "runs": true
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/src/browser/accelerometer.js",
        "id": "org.apache.cordova.device-motion.accelerometer",
        "merges": [
            "navigator.accelerometer"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "uk.co.ilee.shake": "0.2.0",
    "org.apache.cordova.device-motion": "0.2.11"
}
// BOTTOM OF METADATA
});