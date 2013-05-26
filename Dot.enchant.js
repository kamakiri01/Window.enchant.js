var dots = [];

var Dot = enchant.Class.create(enchant.Sprite,{
    initialize: function(){
        enchant.Sprite.call(this,2,2);

        //再利用できるSurfaceを生成する(色変更に対応するため)
        if(Dot.surface == undefined){
            console.log("gen dot surface")
            Dot.surface = new enchant.Surface(18, 2);
            for(var i=0;i<18;i+=2){
                Dot.surface.context.fillStyle = 'rgb(' + Dot.colors[i/2] + ')';
                Dot.surface.context.fillRect(i%18, 0, 2, 2);
            };
        };

        RANDOM_POINTS = false;
        this.x;
        this.y;
        if(RANDOM_POINTS === true){
            this.x = enchant.Core.instance.width /2;
            this.y = enchant.Core.instance.height /2;
        }else{
            this.x = Math.round(Math.random()* 320);
            this.y = Math.round(Math.random()* 320);
        };

        this.polarR = Math.round(Math.random()* 3)+1;
        this.polarT = Math.round(Math.random()* 2 * Math.PI);

        this.accX = Math.round(this.polarR * Math.cos(this.polarT));
        this.accY = Math.round(this.polarR * Math.sin(this.polarT));

//        var sf = new Surface(2, 2);
//        var ctx = sf.context;
//        this.colors = Dot.colors;
//        ctx.fillStyle = 'rgb(' + this.colors[Math.floor(Math.random()*9)] + ')';
//        ctx.fillRect(0, 0, 2, 2);
//        this.image = sf;
        this.image = Dot.surface;
        this.frame = Math.floor(Math.random() *9);

        this.opacity = this.polarR/4;

        this.num  =dots.length;

        dots.push(this);

        this.addEventListener('enterframe',function(){
            this.x += this.accX;
            this.y  +=this.accY;

            if(this.x > 320 || this.x < 0){
                this.accX = - this.accX;
            }
            if(this.y > 320 || this.y < 0){
                this.accY = - this.accY;
            }							
        });
        return this;
    },

    destroy: function(){
        this.parentNode.removeChild(this);
        delete dots[this.num];
        this.removeEventListener('enterframe', arguments.callee);
    }
});
Dot.colors = ['255,255,255', '255,0,0', '255,165,0', '255,255,0', '0,255,0', '0,0,255', '0,0,128', '128,0,128', '255,255,255'];




//ドットを撒く
var DotWindow = enchant.Class.create(enchant.Group, {
    initialize: function(){
        enchant.Group.call(this);
        var WIDTH = enchant.Core.instance.width;
        var HEIGHT = enchant.Core.instance.height;

        var bg = new Sprite(WIDTH, HEIGHT);
        var sf = new Surface(WIDTH, HEIGHT);
        var ctx = sf.context;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        bg.image = sf;
        this.addChild(bg);

        var param = new Label("");
        param.x = 5;
        param.y = 5;
        param.font = "16px bold sans";
        param.text = "0 fps";
        param.color = "black";
        this.addChild(param);
        param.addEventListener('enterframe', function(){
            param.text = framedata+"/"+enchant.Core.instance.fps+ " fps";
        })

        var cbutton = new Label("");
        cbutton.x = 80; cbutton.y = 5;
        cbutton.font = "16px bold sans";
        cbutton.text = "0 dots";
        cbutton.color = "";
        this.addChild(cbutton);

        var dbutton = new Label("");
        dbutton.x = 250; dbutton.y = 5;
        dbutton.font = "16px bold sans";
        dbutton.text = "delete all";
        dbutton.color = "";
        this.addChild(dbutton);

        this.addEventListener('enterframe', function(){
            var thisDate = new Date;
            framedata = Math.round(1000 / (thisDate - lastDate));
            lastDate = thisDate;

            cbutton.text = dots.length  + " dots";
        });
        this.addEventListener('touchstart', function(e){
            if (e.y > 50){
                this.createDots(500);
            }else{
                console.log("delete start");
                this.deleteAllDots();
            }
        });
        return this;
    },

//Util
    changeDotImage: function(imgNum){
        if(typeof imgNum !== "number"){
            return;
        };
        if(imgNum <= 8){
            imgNumGen = function(){ return Math.floor(imgNum)};

        }else if(imgNum > 9){
            imgNumGen = function(){ return Math.floor(Math.random()*9)};
        };

        var targetLength = Dot.collection.length;
        for(var i=0;i<targetLength;i++){
//            var sf = new Surface(2, 2);
//            var ctx = sf.context;
//            ctx.fillStyle = 'rgb(' + Dot.colors[ imgNumGen() ] + ')';
//            ctx.fillRect(0, 0, 2, 2);
//            Dot.collection[i].image = sf;            
            Dot.collection[i].frame = imgNumGen();
        }
    },
    createDots: function(num){
        for(var i=0;i<num;i++){
            var dot = new Dot();
            this.addChild(dot);
        }
    },
    deleteAllDots: function(){
        for(var i in dots){
            dots[i].destroy();
        };
        dots = [];
    }
});


