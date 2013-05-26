/**
 * @fileOverview
 * Window.enchant.js
 * @version 0.0.2
 * @require enchant.js v0.6.2+
 * @author kamakiri01
 *
 * @description
 * create window dialog in your scene. privent touch event to other entity.
 *
 */

//ウインドウにEntityを配置したい場合、
//this.digにaddcChildする

//dig上に配置したEntityをタッチ移動してウインドウごと移動させたい場合、
//タッチイベントでthis.dig._isTouchのトグルを行う

//透明なレイヤーを張ってタッチイベントの透過を止める
var LayerWindow = enchant.Class.create(enchant.Group,{
    initialize: function(){
        enchant.Group.call(this);
        var WIN_WIDTH = enchant.Core.instance.width;
        var WIN_HEIGHT = enchant.Core.instance.height;

        var bg = new Sprite(WIN_WIDTH, WIN_HEIGHT);
        var sf = new Surface(WIN_WIDTH, WIN_HEIGHT);
        var ctx = sf.context;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, WIN_WIDTH, WIN_HEIGHT);
        bg.image = sf;
        bg.opacity = 0;
        this.addChild(bg);
    }
});

//ポップアップ風ウィンドウを作る(座標指定)
var MenuWindow = enchant.Class.create(LayerWindow, {
    initialize: function(width, height){
        LayerWindow.call(this);

        //ダイアログの本体(addChildはこの要素に行う)
        this.dig = new Group();
        this.dig._window = this;

        //タッチ移動の処理
        this.dig._isTouch = false;
        this.dig._touchX = 0;
        this.dig._touchY = 0;

        //ダイアログBGの設定
        var bg = new Sprite(width, height);
        var np = new enchant.widget.Ninepatch(width, height);
        np.src = enchant.Core.instance.assets['navigationBar.png'];
        bg.image = np;
        this.dig.addChild(bg);

        //背景部分をタッチしてウインドウ移動
        bg._dig = this.dig;
        
        bg.addEventListener('touchstart', function(){
            bg._dig._isTouch = true;
        });
        bg.addEventListener('touchend', function(){
            bg._dig._isTouch = false;
        });

        //ウインドウ移動処理
        this.dig.addEventListener('touchstart', function(e){
            this._touchX = e.x - this.x;
            this._touchY = e.y - this.y;
        });
        this.dig.addEventListener('touchmove', function(e){
            if(this._isTouch === true){
                this.x += (e.x - this._touchX - this.x)/2;
                this.y += (e.y - this._touchY - this.y)/2;
            };
        });
        this.dig.addEventListener('touchend', function(e){
            this._touchX = 0;
            this._touchY = 0;
        });
    },

    //width opening effect.
    addChildTo: function(target){
        target.addChild(this);
        target.addChild(this.dig);

        this.dig.scaleX = 1;
        this.dig.scaleY = 1/100;

        this.dig.tl
            .scaleTo(1, 1, 5, enchant.Easing.QUINT_EASEINOUT)
            .and().moveBy(0, -85 , 5, enchant.Easing.QUINT_EASEINOUT);
    },
    //with closing effect.
    removeChildFrom: function(target){
        var that = this;
        this.dig.tl
            .scaleTo(1, 1/100, 5, enchant.Easing.QUINT_EASEINOUT)
            .and().moveTo(this.dig.x, this.dig.y + 85 , 5, enchant.Easing.QUINT_EASEINOUT)
            .then(function(){
                target.removeChild(that);
                target.removeChild(this);
            });
    }    
});

