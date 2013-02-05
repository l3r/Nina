///<reference path="Ladder.ts"/>
///<reference path="Pipe.ts"/>
///<reference path="InteractiveFire.ts"/>
///<reference path="ElectricPole.ts"/>
///<reference path="ElectricWire.ts"/>

interface IPuzzleManager
{
    CreatePuzzle(puzzle: BasePuzzle);
    RemovePuzzle(puzzle: BasePuzzle);
}

class PuzzleManager implements IPuzzleManager
{
    private _dynamicObjects: BasePuzzle[];
    //ladder: Ladder;
    pole: ElectricPole;
    pole2: ElectricPole;
    //wire: ElectricWire;
    pipe: Pipe;
    pipe2: Pipe;

    constructor(  )
    {
       // this.ladder = new Ladder(550, 580);
       // this.pole = new ElectricPole(450, 580);
       // this.pole2 = new ElectricPole(150, 580);
       // this.wire = new ElectricWire(this.pole, this.pole2);
       // this.pipe = new Pipe(null, 800, 640);
       // this.pipe2 = new Pipe(this.pipe, 1100, 640);
        this._dynamicObjects = [];
          this.CreatePuzzle(new InteractiveFire(this));
          this.CreatePuzzle(this.pole = new ElectricPole(450, 580));
          this.CreatePuzzle(this.pole2 = new ElectricPole(150, 580));
          this.CreatePuzzle(new Ladder(550, 580));
          this.CreatePuzzle(new ElectricWire(this.pole, this.pole2));
          this.CreatePuzzle(this.pipe = new Pipe(null, 800, 640));
          this.CreatePuzzle(this.pipe2 = new Pipe(this.pipe, 1100, 640));
          
    }

    //creates a new puzzle and adds it to the array of dynamicPuzzles
    CreatePuzzle(puzzle: BasePuzzle)
    {
        if (puzzle == null) throw new Error( "create a new instance of the puzzle that should be added" );
        this._dynamicObjects.push(puzzle);
    }

    RemovePuzzle(puzzle: BasePuzzle)
    {
        var i: number = this._dynamicObjects.indexOf(puzzle);
        if ( i < 0 )    return; //if i is not in our array, we don't remove it ( logically =) )
        this._dynamicObjects.splice(i);
    }

    update( )
    {
        for (var i = 0; i < this._dynamicObjects.length; i++)
        {
            var p: BasePuzzle = this._dynamicObjects[i];
            p.Update();
        }
    }

    draw(ctx)
    {
        for (var i = 0; i < this._dynamicObjects.length; i++)
        {
            var p: BasePuzzle = this._dynamicObjects[i];
            p.Draw(ctx);
        }
    }
}