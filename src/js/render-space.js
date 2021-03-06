import events from './events';
import util from './utils';

let sceneEl = document.querySelector('a-scene');
let assetsEl = document.createElement('a-assets');

function setAttributeFromGunData(data, key){
    let value = data;
    delete value['_']; // 건디비 데이터에 삽입되어있는 _ 메타데이터 제거
    if(util.checkEmpty(value)){
        console.log('value is empty');
        return;
    }
    // console.log(key);
    el.setAttribute(key, value);
};
// callbacks of gun
async function createEl(data, key) {
    if (data.visible === false) return;
    if (data.id === L.user.id) return;
    let el = document.querySelector('#' + data.id);
    // if there is no dom element, create it.
    if ((el === null) || (el === undefined)) {
        console.log(data.id);
        if (data.tagName === 'a-marker') {
            el = document.createElement('a-entity');
        } else {
            el = document.createElement(data.tagName);
        }
        if (data.tagName === 'a-asset-item') {
            el.setAttribute('src', 'default');
        }

        el.setAttribute('id', data.id);
        // el.setAttribute('geometry', {primitive: 'cone'});
        // el.setAttribute('material', {color: 'green'});
        // el.setAttribute('scale', '0.5 0.5 0.5');

        this.get('attributes').map(function (data, key) {
            if (key !== 'position')
                return data;
            return undefined;
        }).on(function setAttributeFromGunData(data, key) {
            let value = data;
            if (value.hasOwnProperty('_')) {
                delete value['_']; // 건디비 데이터에 삽입되어있는 _ 메타데이터 제거
            }
            if (util.checkEmpty(value)) {
                console.log('value is empty');
                return;
            }
            // console.log(key);
            el.setAttribute(key, value);
        });

        this.get('attributes').get('position').once(function setAttributeFromGunData(data, key) {
            let value = data;
            if (value === undefined) return;
            if (value.hasOwnProperty('_')) {
                delete value['_']; // 건디비 데이터에 삽입되어있는 _ 메타데이터 제거
            }
            if (util.checkEmpty(value)) {
                console.log('value is empty');
                return;
            }
            // console.log(key);
            el.setAttribute(key, value);
        });

        if (data.parent === undefined || data.parent === null || data.parent === '' || data.parent === 'scene') {
            let sceneEl = await document.querySelector('a-scene')
            let count = document.querySelectorAll('#' + data.id).length;
            if(count === 0){
                sceneEl.appendChild(el);
                console.log(data.id +' is appended.')
            }else{
                // el.remove();
            }
            if (el.getAttribute('id') === L.user.name) {
                // events.dispatchLoadMyobject();
            }
        } else {
            let parentEl = document.querySelector('#' + data.parent);
            let count = document.querySelectorAll('#' + data.id).length;
            if(count === 0){
                parentEl.appendChild(el);
                console.log(data.id +' is appended.')
            }else{
                // el.remove();
            }
        }
    }
};

let initAssets= function(){
    G.assets.map().once( createEl );
};
let initObjects = function(){
    console.log('start rendering scene objects');
    // G.scene.get('children').map().once( initChildren );
    G.scene.get('children').map().on( initChildren );
};

// recursive
let initChildren = function(data, key){
    this.once( createEl );
    if(data.children !== undefined){
        // this.get('children').map().once( initChildren )
        this.get('children').map().on( initChildren )
    }
};

window.addEventListener('getuser', function(){
    initAssets();
    initObjects();
    G.objects.map().once(createEl);

    G.objects.map().get('visible').on(function receiveVisible(data, key){
        if(data === true){
            this.back().once(createEl);
        }else{
            this.back().once(function removeEl(data, key){
                let el =document.querySelector('#' + data.id);
                if( (el !== null) && (el !== undefined) ){
                    el.remove();
                }
            });
        }

    });
});




