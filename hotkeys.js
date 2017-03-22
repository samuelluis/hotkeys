// Object to save the replaced hotkeys 
var comboMap = {};

Hotkeys = function(options) {
    this.hotkeys = [];
    this.options = options || {};

    if (this.options.autoLoad === undefined) {
        this.options.autoLoad = true;
    }

    this.bind = function(hotkey,rebind){
        if(!rebind) comboMap[hotkey.combo].push(hotkey.callback);
        _.each(hotkey.elements, function(elem){
            if(hotkey.forms) $(elem).find("input,textarea,select").addClass("mousetrap");
            console.log("bind",hotkey.combo,"to",elem);
            Mousetrap(elem).bind(hotkey.combo, hotkey.callback, hotkey.evenType);
        });
    };

    this.unbind = function(hotkey){
        _.each(hotkey.elements, function(elem){
            if(hotkey.forms) $(elem).find("input,textarea,select").removeClass("mousetrap");
            console.log("unbind",hotkey.combo,"from",elem);
            Mousetrap(elem).unbind(hotkey.combo);
        });
    };

    this.destroy = function(hotkey){
        _.each(hotkey.elements, function(elem){
            if(hotkey.forms) $(elem).find("input,textarea,select").removeClass("mousetrap");
            console.log("destroy",elem);
            Mousetrap(elem).destroy();
        });
    };
};

_.extend(Hotkeys.prototype, {
    add: function(hotkey) {
        // find elements hotkeys will be applied to
        hotkey.elements = $(hotkey.selector||document);
        if(hotkey.elements.length === 0) return;

        // add all hotkeys to local collection
        this.hotkeys.push(hotkey);

        // Small Error check
        if(!_.isArray(hotkey.combo)){
            check(hotkey.combo, String);
        }

        if(!_.isString(hotkey.evenType)){
            hotkey.evenType = '';
        }

        if (!_.isFunction(hotkey.callback)) {
            throw new Meteor.Error(001, 'Error 001: Callback is not a Function');
        }

        var comboMapEntry = comboMap[hotkey.combo];
        if (!_.isArray(comboMapEntry)) {
             comboMap[hotkey.combo] = []
        }
        if (this.options.autoLoad === true) {
            this.bind(hotkey);
        }
    },

    load: function() {
        hk = this;
        _.each(this.hotkeys, function(hotkey) {
            hk.bind(hotkey);
        })
    },

    unload: function() {
        hk = this;
        _.each(this.hotkeys, function(hotkey) {
            var comboMapEntry = comboMap[hotkey.combo];

            _.each(comboMapEntry, function(func, index){
            	if(func == hotkey.callback){
            	    console.log("splice",comboMap[hotkey.combo].length);
                    comboMapEntry.splice(index,1);
            	}
            });

            console.log("unload",comboMapEntry.length,"from", hotkey.combo);

            // bind it back to the original one
            hk.unbind(hotkey);
            if(comboMapEntry.length > 0){
                console.log("rebind");
                hotkey.callback = comboMapEntry[comboMapEntry.length -1 ];
                hk.bind(hotkey, true);
            }

        })

    }
});

Hotkeys.reset = function(){
    // console.log("reset");
    Mousetrap.reset();
    comboMap = {};
};