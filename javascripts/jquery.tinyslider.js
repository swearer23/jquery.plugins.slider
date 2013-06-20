(function($){
    $.fn.tinySlide = function(options){
        var options = options ? options : {};
        var tinySlide = new TinySlide(this, options);
        tinySlide.init();
        tinySlide.initUI();
        tinySlide.initControls();
        tinySlide.roll();
        return this;
    }

    function TinySlide(wrapper , options){
        this.options = options;
        this.wrapper = wrapper;
        this._contents;
        this._singleWidth;
        this._singleHeight;
        this._count;
        this._TSW;
        this._curEle;
        this._cursorIndex;
        this._interval;
    }
    
    TinySlide.prototype.init = function(){
        if(this._checkNecessaryOptions()){
            this.options = this._mergeOptions();
            this._contents = this.options.contents;
            this._setCurState();
            this._setMapPointer();
        }
    }

    TinySlide.prototype.initUI = function(){
        var _this = this;
        this._singleWidth = this.wrapper.width();
        this._singleHeight = this.wrapper.height();
        this._count = this._contents.size();
        this._TSW = this.wrapper.wrapInner("<div class='TStinySlideWrapper'>").find(".TStinySlideWrapper");
        this._TSW.width(this._singleWidth * this._count);
        this._TSW.height(this._singleHeight);
        this.wrapper.css({"position" : "relative"});
        this._TSW.css({"position" : "absolute" , "top" : 0 , "left" : 0});
        this._contents.each(function(){
            $(this).width(_this._singleWidth);
            $(this).height(_this._singleHeight);
            $(this).css({"float" : "left"});
        })
    }

    TinySlide.prototype.initControls = function(){
        var _this = this;
        if(this.options["controls"]){
            var controls = this.options["controls"];
            if(controls["prev"]){
                this._bindingEvents(controls["prev"] , function(){
                    if(_this._cursorIndex > 0){
                        _this._rollStep(_this._cursorIndex - 1);
                    }
                })
            };
            if(controls["next"]){
                this._bindingEvents(controls["next"] , function(){
                    if(_this._cursorIndex < _this._count - 1){
                        _this._rollStep(_this._cursorIndex + 1);
                    }
                })
            };
            if(controls["pointers"]){
                this._bindingEvents(controls["pointers"] , function(){
                    var mapIndex = controls["pointers"]["obj"].index(this);
                    _this._rollStep(mapIndex);
                })
            }
        }
    }

    TinySlide.prototype.roll = function(){
        var _this = this;
        this._curEle = this._contents.first();
        this._interval = setInterval(function(){
            if(_this._cursorIndex < _this._count - 1){
                var index = _this._cursorIndex + 1;
            }else{
                var index = 0;
            }
            _this._rollStep(index);
        }, _this.options.interval);
    }

    TinySlide.prototype._rollStep = function(index){
        var _this = this;
        var distance = -index * this._singleWidth;
        this._TSW.animate({"left" : distance});
        this._setCurState(index);
        this._setControls();
        this._setMapPointer(index);
    };

    TinySlide.prototype._setCurState = function(index){
        var _this = this;
        this._contents.filter("."+_this.options["cursorClass"]).first().removeClass(_this.options["cursorClass"]);
        this._cursorIndex = index ? index : 0;
        this._curEle = $(this._contents[index]);
        this._curEle.addClass(_this.options["cursorClass"]);
    }

    TinySlide.prototype._setControls = function(){
        if(this.options["controls"]){
            var controls = this.options["controls"];
            if(controls["prev"]){
                var activeClass = controls.prev.activeClass ? controls.prev.activeClass : "activeClass";
                if(this._hasPrev()){
                    controls.prev.obj.addClass(activeClass);
                }else{
                    controls.prev.obj.removeClass(activeClass)
                }
            }
            if(controls["next"]){
                var activeClass = controls.next.activeClass ? controls.next.activeClass : "activeClass";
                if(this._hasNext()){
                    controls.next.obj.addClass(activeClass);
                }else{
                    controls.next.obj.removeClass(activeClass);
                }
            }
        }
    }

    TinySlide.prototype._setMapPointer = function(mapIndex){
        var pointers = this.options.controls["pointers"];
        if(pointers){
            var mapIndex = mapIndex ? mapIndex : 0;
            var curPointerClass = pointers["curPointerClass"];
            curPointerClass = curPointerClass ? curPointerClass : "curMapPointer";
            pointers.obj.removeClass(curPointerClass);
            $(pointers.obj[mapIndex]).addClass(curPointerClass);
        }
    }

    TinySlide.prototype._bindingEvents = function(control , fn){
        var obj = control["obj"];
        var evt = control["evt"] ? control["evt"] : "click";
        obj.on(evt , fn);
    }
    
    TinySlide.prototype._checkNecessaryOptions = function(){
        var checkFlag = true;
        if(!this.options["contents"]){
            alert("option contents missing from arguments!!!");
            return false;
        }
        return checkFlag;
    }
    
    TinySlide.prototype._mergeOptions = function(){
        var defaultOptions = {
            "autoMove"      : true,
            "interval"      : 1000,
            "cursorClass"   : "TScursor"
        }
        for(var k in defaultOptions){
            if(!this.options[k]){
                this.options[k] = defaultOptions[k];
            }
        }
        return this.options; 
    }

    TinySlide.prototype._hasPrev = function(){
        if(this._cursorIndex > 0){
            return true;
        }else{
            return false;
        }
    }

    TinySlide.prototype._hasNext = function(){
        if(this._cursorIndex < this._count - 1){
            return true;
        }else{
            return false;
        }
    }

})(jQuery)
