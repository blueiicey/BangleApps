{
    g.reset();
    const SETTINGS_FILE = "iceclient.json";
    let s = require("Storage");
    const settings = s.readJSON('setting.json', 1);
    let brightness = settings.brightness;
    let timeout = settings.timeout;
    if (s.readJSON(SETTINGS_FILE) === undefined) {
        //create iceclient.json file
        s.writeJSON(SETTINGS_FILE, {
            brightness: brightness,
            timeout: timeout
        });
    } else {
        //update iceclient.json file if neccesary
        if (s.readJSON(SETTINGS_FILE).brightness !== brightness && brightness !== 0.1) {
            //default screen brightness has changed
            s.writeJSON(SETTINGS_FILE, {
                brightness: brightness,
                timeout: timeout
            });
        }
        if (s.readJSON(SETTINGS_FILE).timeout !== timeout && timeout !== 0) {
            //default screen timeout has changed
            s.writeJSON(SETTINGS_FILE, {
                brightness: brightness,
                timeout: timeout
            });
        }
    }

    var menu = {
        "": {
            "title": "ice client"
        },
        "Quiet Mode": function () {
            if (settings.vibrate || settings.beep !== false || settings.quiet === 0) {
                //enable quiet mode
                settings.vibrate = false;
                settings.beep = false;
                settings.quiet = 1;
                s.writeJSON("setting.json", settings);
            } else if (settings.vibrate === false || settings.beep === false || settings.quiet === 1) {
                //disable quiet mode
                settings.vibrate = true;
                settings.beep = "vib";
                settings.quiet = 0;
                s.writeJSON("setting.json", settings);
            }
        },
        "Dark Mode": function () {
            if (brightness !== .1) {
                //enable dark mode
                Bangle.setLCDBrightness(0.1);
                settings.brightness = 0.1;
                s.writeJSON("setting.json", settings);
            } else if (brightness === .1) {
                //disable dark mode
                Bangle.setLCDBrightness(s.readJSON(SETTINGS_FILE).brightness);
                settings.brightness = s.readJSON(SETTINGS_FILE).brightness;
                s.writeJSON("setting.json", settings);
            }
        },
        "LCD Timeout": function () {
            if (timeout !== 0) {
                //disable lcd timeout (always on)
                Bangle.setLCDTimeout(0);
                settings.timeout = 0;
                s.writeJSON("setting.json", settings);
            } else if (timeout === 0) {
                //set lcd timeout back to default
                Bangle.setLCDTimeout(s.readJSON(SETTINGS_FILE).timeout);
                settings.timeout = s.readJSON(SETTINGS_FILE).timeout;
                s.writeJSON("setting.json", settings);
            };
        },
        "Exit": function () {
            Bangle.load();
        },
    };
    E.showMenu(menu);
}
