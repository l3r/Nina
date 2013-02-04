/**
 * Game.js
 * This is the main game object which controls gameloop and basically everything in the game
 *
 */
///<reference path="system/Camera.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Utilies.ts"/>
///<reference path="Walter.ts"/>
///<reference path="Alex.ts"/>
///<reference path="animation/Sprite.ts"/>

class Game
{

    canvas: HTMLCanvasElement;
    canvasContext: CanvasRenderingContext2D;
    walter: Walter;
    alex: Alex;
    camera: Camera;
    
    platforms = [];
    levelDataString = '{"platforms":[{"x":6,"y":677,"h":30,"w":386},{"x":362,"y":704,"h":1017,"w":30},{"x":362,"y":1720,"h":30,"w":1309},{"x":1641,"y":1749,"h":270,"w":30},{"x":1641,"y":2013,"h":30,"w":673},{"x":2304,"y":1670,"h":372,"w":36},{"x":2336,"y":1670,"h":30,"w":580}]}';

    constructor()
    {
        Graphics.init();

        //Create action canvas
        this.canvas = Graphics.createCanvas("action");

        //This is the GL context used to draw to the screen
        this.canvasContext = this.canvas.getContext("2d");

        Physics.init(this.canvasContext);
        this.demo();

        this.walter = new Walter();
        this.alex = new Alex();
        this.camera = new Camera(AssetManager.getImage("level").width, AssetManager.getImage("level").height, this.canvas.width, this.canvas.height);
        this.createPlatforms();
    }


    update()
    {
        this.walter.update();
        this.alex.update();
        this.camera.update();
    }

    step()
    {
        // Physics world time-step
        Physics.world.Step((1 / 60), 10, 10);
    }

    draw()
    {
        //Clear the previous frame from the screen
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Blit a section of the Level image onto the screen
        this.canvasContext.drawImage(
            AssetManager.getImage("level"),
            this.camera.getX(),
            this.camera.getY(),
            this.canvas.width,
            this.canvas.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
       );

        // Saving the GL context here
        this.canvasContext.save();

        //Modifying the GL context here, by translating the origin 
        this.canvasContext.translate(-this.camera.getX(), -this.camera.getY());

            //Draw all entities here
            this.alex.draw(this.canvasContext);
            this.walter.draw(this.canvasContext);
            Physics.world.DrawDebugData();

        //Restore previous GL context
        this.canvasContext.restore();


    }

    createPlatforms()
    {
        var levelData = JSON.parse(this.levelDataString);
        for (var i in levelData["platforms"]) {
            var x = levelData["platforms"][i].x;
            var y = levelData["platforms"][i].y;
            var w = levelData["platforms"][i].w / 2;
            var h = levelData["platforms"][i].h / 2;
            this.platforms.push(new Platform(x + w, y + h, w, h));
        }
    }

    demo()
    {
        var canvas = this.canvas;
        // Create static ground
        var bounds = 20;
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.2;
        fixDef.shape = new b2PolygonShape;

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;

        //bottom wall
        fixDef.shape.SetAsBox(canvas.width / Physics.worldScale, 0);
        bodyDef.position.x = 0;
        bodyDef.position.y = canvas.height / Physics.worldScale;
        Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //left wall
        fixDef.shape.SetAsBox(bounds / Physics.worldScale, canvas.height / Physics.worldScale);
        bodyDef.position.x = bounds * -1 / Physics.worldScale;
        bodyDef.position.y = 0;
        Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //right wall
        //fixDef.shape.SetAsBox(0, canvas.height / Physics.worldScale);
        //bodyDef.position.x = canvas.width / Physics.worldScale;
        //bodyDef.position.y = 0;
        //Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);

        //top wall
        fixDef.shape.SetAsBox(canvas.width / Physics.worldScale, bounds / Physics.worldScale);
        bodyDef.position.x = 0;
        bodyDef.position.y = bounds * -1 / Physics.worldScale;
        Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);


        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.0;
        fixDef.shape = new b2PolygonShape;

        //create some objects
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        for (var i = 0; i < 20; ++i)
        {
            if (Math.random() > 0.5)
            {
                fixDef.shape = new b2PolygonShape;
                fixDef.shape.SetAsBox(
                Math.random() + 0.1 //half width
                ,
                Math.random() + 0.1 //half height
                );
            } else
            {
                fixDef.shape = new b2CircleShape(
                Math.random() + 0.1 //radius
                );
            }
            bodyDef.position.x = Math.random() * 25;
            bodyDef.position.y = Math.random() * 10;
            Physics.world.CreateBody(bodyDef).CreateFixture(fixDef);
        }

    }

}
