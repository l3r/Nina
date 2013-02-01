/**
 * Game.js
 * This is the main game object which controls gameloop and basically everything in the game
 *
 */
///<reference path="system/Camera.ts"/>
///<reference path="system/Graphics.ts"/>
///<reference path="system/AssetManager.ts"/>
///<reference path="system/Utilies.ts"/>

class Game
{

    canvas : HTMLCanvasElement ;
    canvasContext : CanvasRenderingContext2D;

    constructor()
    {
        Graphics.init();

        //Create action canvas
        this.canvas = Graphics.createCanvas("action");
        this.canvasContext = this.canvas.getContext("2d");

        Physics.init(this.canvasContext);
    }


    update()
    {
        

    }

    step()
    {    
        Physics.world.Step((1 / 60), 10, 10);
    }

    draw()
    {
       this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
       this.canvasContext.fillStyle = "red";
       this.canvasContext.fillRect(800, 500, 100, 100);
       this.canvasContext.drawImage(AssetManager.getImage("placeHolderImage") ,20,20);

    }

}