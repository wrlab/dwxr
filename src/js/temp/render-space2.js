
let sceneEl = document.querySelector('a-scene');
let assetsEl = document.createElement('a-assets');



// callbacks of gun
let createEl = function (data, key) {
    let el;
    // if there is no dom element, create it.
    if (document.querySelector('#' + data.id) === null) {
        if(data.tagName === 'a-marker'){
            el = document.createElement('a-entity');
        }else{
            el = document.createElement(data.tagName);
        }
        if(data.tagName === 'a-asset-item'){
            el.setAttribute('src','default');
        }
        el.setAttribute('id', data.id);
        this.get('attributes').once().map().once((data, key) => {
            el.setAttribute(key, data);
        });

        if (data.parent === undefined || data.parent === null || data.parent === '' || data.parent === 'scene') {
            document.querySelector('a-scene').appendChild(el);
        } else {
            let parentEl = document.querySelector('#' + data.parent);
            parentEl.appendChild(el);
        }
    }
};

let displayCurrentUser = function(data, key){
    if(data.alias === undefined) return;
    let el = document.querySelector('#'+'nav-' + data.alias);
    if(el === null) {
        el = document.createElement('i');
        el.setAttribute('id', 'nav-' + data.alias);
        el.classList.add('fas');
        el.setAttribute('data-toggle', 'tooltip')
        el.setAttribute('data-placement','bottom')
        el.setAttribute('title',data.alias);
        this.get(getSpaceID()).once(function(data){
            el.classList.add('fa-' + data.animal);
            el.classList.add('text-' + data.color);
        });
        document.querySelector('#nav-current').appendChild(el);
        jq('#nav-'+data.alias).tooltip();
    }
};

let animalCurrentUser = function(data, key){
    let animal = data;
    if(animal === false) return;
    this.back(2).once(function(data, key){
        if(data.alias === undefined) return;
        let el = document.querySelector('#'+'nav-' + data.alias);
        if(el === null){
            this.once(displayCurrentUser);
        }else{
            el.classList.add('fa-' + animal);
        }
    })
};

let colorCurrentUser = function(data, key){
    let color = data;
    if(color === false) return;
    this.back(2).once(function(data, key){
        if(data.alias === undefined) return;
        let el = document.querySelector('#'+'nav-' + data.alias);
        if(el === null){
            this.once(displayCurrentUser);
        }else{
            el.classList.add('text-' + color);
        }
    });
};
// Initialize space
function testJsonToGun(){
    let obj = {
        id: 'gift2',
        tagName: 'a-box',
        parent: 'scene',
        attributes:{
            position: {x:1, y:2, z:-3},
            rotation: {x:0, y:45, z:45},
            scale: {x:1, y:1, z:1},
            color: 'blue',
            'transform-controls' : { activated: false },
        }
    };

    // <a-box id='gift' position="x:0; y:0; z:0" rotation="x:0; y:45; z:45" scale="x:1; y:1; z:1" color=red" transform-controls={activated: false}>

    G.objects.get( obj.id ).put(obj);
    G.scene.get('children').set( G.objects.get( obj.id ) );
}


let subscribe = function(){

    G.space.get('title').on( function(data){
        jq('#title').text(data);
    });

    G.space.get('participants').map().get(getSpaceID()).get('now').on(function(data){
        if( data ){ // true
            this.back(2).once(displayCurrentUser);
        } else { // exit
            this.back(2).once(function(data, key){
                if(data.alias === undefined) return;
                let el = document.querySelector('#'+'nav-' + data.alias);
                if(el !== null) {
                    this.get(getSpaceID()).get('now').once(function(data){
                        if(data) return;
                        el.remove();
                    })
                }
            })
        }
    });
    G.space.get('participants').map().get(getSpaceID()).get('animal').on( animalCurrentUser );
    G.space.get('participants').map().get(getSpaceID()).get('color').on( colorCurrentUser );

    let syncPosition = function ( data, key ){
        let el = document.querySelector('#'+key);
        if(el){
            let object = el.object3D;
            if( object !== undefined ) {
                this.get('attributes').get('position').once(function (data) {
                    // console.log(data);
                    if(data !== undefined){
                        object.position.copy(data);
                    }
                });
            }
        }
    }

    G.objects.once().map().get('attributes').get('position').on(function receivePosition(data, key){
        let receivedAt = Date.now();
        let subLog ={};
        subLog.receivedAt = receivedAt;
        subLog.subscriber = S.myAlias;
        subLog.data ={};
        subLog.data.position = {x: data.x, y: data.y, z: data.z};
        this.back(2).once( syncPosition );
        this.back(2).once(function (data, key){
            subLog.data.id = key;
            // console.log(subLog);
            // if( ) // 내가 보낸 데이터인지 어떻게 아냐 어후
            // logger.log('info', subLog);
            //
            S.subLogs.push(subLog);
            // window.bugout.log(subLog);
            // jq.ajax({
            //     url: location.origin + '/api/subLog/create',
            //     type:'POST',
            //     data: subLog,
            //     success: function(data){
            //         // alert("완료!");
            //         // window.opener.location.reload();
            //         // self.close();
            //     },
            //     error: function(jqXHR, textStatus, errorThrown){
            //         console.log("post failed - " + textStatus + ": " + errorThrown);
            //     }
            // });
        });

        // 아이디는 어떻게.. 어떻게.. 디비에 따로 넣으면 되나 ?
    });

};

let I = function(){

    let initPath = function(){
        G.space = S.app.get('spaces').get( getSpaceID() );
        G.scene = G.space.get('scene');
        G.assets = G.space.get('assets');
        G.objects = G.space.get('objects');
    };

    let joinSpace = function(){
        console.log(S.myAlias + ' wanna join here!')

        G.space.get('participants').set( S.myData );
        G.space.get('participants').once().map().once( function(data, key){
            if(key === '~' + S.myPair.pub){
                let animals = ['paw', 'hippo', 'dog', 'spider', 'kiwi-bird',
                    'frog', 'fish', 'dragon', 'dove', 'cat'];
                let colors = ['blue', 'indigo', 'purple', 'pink', 'red',
                    'orange', 'yellow', 'green', 'teal', 'cyan'];
                this.get(getSpaceID()).put({
                    'animal': animals[Math.floor(Math.random() * animals.length)],
                    'color': colors[Math.floor(Math.random() * colors.length)],
                });
                this.get(getSpaceID()).get('now').put(true);
                G.me = this;
            }
        });
    };

    let initCurrentParticipants = function () {
        G.space.get('participants').once().map().get(getSpaceID()).get('now').once(function(data){
            if( data ){ // true
                this.back(2).once(displayCurrentUser);
            } else { // exit
                this.back(2).once(function(data, key){
                    if(data.alias === undefined) return;
                    let el = document.querySelector('#'+'nav-' + data.alias);
                    if(el !== null) {
                        this.get(getSpaceID()).get('now').once(function(data){
                            if(data) return;
                            el.remove();
                        })
                    }
                })
            }
        });
    };

    let initTitle = function(){
        let t = jq('#title');
        G.space.once(function(data, key){
            t.text(data.title);
        })
    };
    let createEnterAR = function(){
        let ui = document.createElement('div')
        ui.classList.add('a-enter-ar');
        let btn = document.createElement('button');
        btn.classList.add('a-enter-ar-button');
        btn.setAttribute('title', 'Enter AR mode with a camera')

        ui.appendChild(btn);
        sceneEl.appendChild(ui);

        btn.addEventListener('click',function(){
            let pathname = location.pathname;
            let middlePath;
            if(pathname.startsWith('/space')){
                middlePath = '/space/ar/';
            }else if( pathname.startsWith('/test')){
                middlePath = '/test/ar/'
            }
            window.location.href = window.location.origin + middlePath + getSpaceID();
        });
    };

    let initAssets= function(){
        G.assets.map().once( createEl );
    };

    let initObjects = function(){
        G.scene.get('children').map().once( initChildren );
    };

    // recursive
    let initChildren = function(data, key){
        this.once( createEl );
        if(data.children !== undefined){
            this.get('children').once().map().once( initChildren )
        }
    };

    initPath();
    joinSpace();
    initCurrentParticipants();
    initTitle();
    createEnterAR();
    initAssets();
    initObjects();
    subscribe();
};


;(()=>{
    // when user leaves this space, remove the user in participants list

    document.addEventListener('sslogin', I );

    S.spaceoff = new Event('spaceoff');
    window.addEventListener('spaceoff', function(){
        G.me.get(getSpaceID()).get('now').put(false);
        G.me.get(getSpaceID()).get('animal').put(false);
        G.me.get(getSpaceID()).get('color').put(false);

    });
    window.onbeforeunload = function(e){
        window.dispatchEvent(S.spaceoff);
    }
})();

