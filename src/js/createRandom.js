(function createCreateButton(){
    let sceneEl = document.querySelector('a-scene');

    let ui = document.createElement('div');
    ui.classList.add('create-random');
    let btn = document.createElement('button');
    btn.classList.add('btn');
    btn.classList.add('btn-primary');
    btn.innerText = 'Create Random!';

    ui.appendChild(btn);
    sceneEl.appendChild(ui);

    btn.addEventListener('click', putRandom);

    let geometries = ['box', 'cone', 'cylinder','dodecahedron', 'icosahedron', 'octahedron', 'ring', 'sphere','tetrahedron', 'torus'];

    function putRandom(){
        console.log('create random!!');

        // for color
        let rgb = {
            r: Math.floor( Math.random()*255),
            g: Math.floor( Math.random()*255),
            b: Math.floor( Math.random()*255)
        };
        function toHex(numbers) {
            var r = numbers.r.toString(16), /* 1 */
                g = numbers.g.toString(16),
                b = numbers.b.toString(16);
            /*
            * Prefix single values with an 0.
            */
            if(r.length === 1) {
                r = 0 + r;
            }
            if(g.length === 1) {
                g = 0 + g;
            }
            if(b.length === 1) {
                b = 0 + b;
            }

            return r + g + b;
        }

        let object = {
            id: S.myAlias + Math.floor( Math.random()*1000 ).toString(16),
            parent: 'scene',
            tagName: 'a-entity',
            attributes: {
                geometry : {
                    primitive: geometries[Math.floor(Math.random()* geometries.length)]  // random geometries
                },
                color: '#'+toHex(rgb),
                position : {
                    x : Math.random() * 16 - 8,
                    y : Math.random() * 10 - 3,
                    z : Math.random() * 25 - 25,
                },
                rotation: {
                    x : Math.random() * 2 * Math.PI,
                    y : Math.random() * 2 * Math.PI,
                    z : Math.random() * 2 * Math.PI

                },
                'transform-controls' : { activated: false }
            }
        };

        G.objects.get( object.id ).put(object);
        G.scene.get('children').set( G.objects.get(object.id) )


    };

})();