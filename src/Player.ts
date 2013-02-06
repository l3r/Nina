
///<reference path="system/Physics.ts"/>
///<reference path="animation/Sprite.ts"/>

class Player implements isPhysicsBody
{
    static DIRECTION = {
        left: -1,
        right: 1
    }

    private _canWalk: bool = true;
    private _canDraw: bool = true;

    // Animated image
    sprite: Sprite;

    //Physics body
    public body;


    public Mayrespawn;

    //Player energy, weather elecitty or water
    private energy;

    // Direction character  is facing
    private direction: number;

    //Amount player moves at
    private speed: number;

    //player can climb
     canClimb: bool;

    //Keyboard Controls
    controls: any;

    //Can jump
    canJump: number;

    // User to dectect weather the player is standing on somthing
    footSensor: any;

    constructor(xInPixels: number, yInPixels: number, animation : SpriteDefinition)
    {
        this.speed = 3;
        this.canJump = 0;
        this.direction = Player.DIRECTION.right;
        this.sprite = new Sprite(animation);
        this.setUpPhysics(xInPixels,yInPixels);
        this.energy = 50;

        //Place a refer to this object in the physics bodies
        // user data so that when their is a collison we 
        // can easily call the correct objects methods to handle it
        this.body.SetUserData(this)
    }

    setCanWalk(value: bool) { this._canWalk = value; }
    getCanWalk() { return this._canWalk; }

    setCanDraw(value: bool) { this._canDraw = value; }
    getCanDraw() { return this._canDraw; }

    getBody() { return this.body; }
    getEnergy() { return this.energy };
    setEnergy(e) { 
        this.energy = e;

        if(this.energy < 0)
            this.energy = 0;

        if(this.energy > 100)
            this.energy = 100;
    };

    update()
    {
        //When the player starts to move have the camera follow them
        if (this.body.GetLinearVelocity().Length() >= 0.01) {
            GameInstance.camera.panToPosition(Physics.vectorMetersToPixels(this.body.GetPosition()));
        }

        if ( !this._canWalk ) return;


        if(this.Mayrespawn)return;


        if (this.canClimb) {
             this.body.SetAwake(false);
        }
        

        if (keyboard.isKeyDown(this.controls.right))
        {
            this.direction = Player.DIRECTION.right;
            this.sprite.update();

             // Small impulse to make the camera follow him: HACK :P
            this.body.ApplyImpulse(new b2Vec2(this.direction*0.5, 0), this.body.GetPosition());

            this.body.SetPosition(new b2Vec2(this.body.GetPosition().x + Physics.pixelToMeters(this.speed), this.body.GetPosition().y));

        }

        if (keyboard.isKeyDown(this.controls.jump))
        {
            if (this.canJump >= 1) {
                var currentPos = this.body.GetPosition();
                var forces = new b2Vec2(0, -2);
                forces.Multiply(5.5);
               // AssetManager.getSound("jump").play();

                this.body.ApplyImpulse(forces, this.body.GetWorldCenter());
            }

            if (this.canClimb) {
                var currentPos = this.body.GetPosition();
                var forces = new b2Vec2(0, -2);
                forces.Multiply(2);
                //this.body.ApplyForce(forces, this.body.GetPosition());
               
                var newPosition = new b2Vec2(this.body.GetPosition().x, this.body.GetPosition().y-=0.2);
                this.body.SetPosition(newPosition);
               
                
            }
        }

        

        if (keyboard.isKeyDown(this.controls.left))
        {
            this.direction = Player.DIRECTION.left;
            this.sprite.update();
           
             // Small impluse to make the camera follow him: HACK :P
            this.body.ApplyImpulse(new b2Vec2(this.direction*0.5, 0), this.body.GetPosition());

            this.body.SetPosition(new b2Vec2(this.body.GetPosition().x - Physics.pixelToMeters(this.speed), this.body.GetPosition().y));
        }

        if (keyboard.isKeyDown(this.controls.down)) {

        }
    }

    MakeCameraFollow()
    {
        this.body.ApplyImpulse(new b2Vec2(this.direction * 0.5, 0), this.body.GetPosition());
    }


    draw(ctx) {
        if ( !this._canDraw )   return;

        //Get position of the physics body and convert it to pixel cordinates
        var pos = Physics.vectorMetersToPixels(this.body.GetPosition());

        ctx.save();
        ctx.translate(pos.x, pos.y);

        if (this.direction == Player.DIRECTION.left) {
            // Used to flip the sprites       
            ctx.scale(-1, 1);
        }

        if (!this.Mayrespawn){
            this.sprite.draw(ctx, -this.sprite.getFrameWidth() / 2, -this.sprite.getFrameHeight() / 2);
         }
        ctx.restore()
    }

    beginContact(contact)
    {

            
        if (this.footSensor == contact.GetFixtureA() || this.footSensor == contact.GetFixtureB())
        {
            this.canJump++;
        }
    }

    endContact(contact)
    {
        if (this.footSensor == contact.GetFixtureA() || this.footSensor == contact.GetFixtureB())
        {
            this.canJump--;
        }
    }

    setUpPhysics(xInPixels, yInPixels)
    {
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 1.0;
        fixDef.restitution = 0.1;

        fixDef.shape = new b2PolygonShape();

        fixDef.shape.SetAsBox(
            Physics.pixelToMeters(this.sprite.getFrameWidth() / 2.5),
            Physics.pixelToMeters(this.sprite.getFrameHeight() / 2)
        );

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = Physics.pixelToMeters(xInPixels);
        bodyDef.position.y = Physics.pixelToMeters(yInPixels);

        this.body = Physics.world.CreateBody(bodyDef).CreateFixture(fixDef).GetBody();
        this.body.SetSleepingAllowed(false);
        this.body.SetFixedRotation(true);

        // Setup foot sensor
        fixDef.shape = new b2PolygonShape();

        fixDef.shape.SetAsBox(
            Physics.pixelToMeters(this.sprite.getFrameWidth() / 3),
            Physics.pixelToMeters(this.sprite.getFrameHeight() / 19)
        );


        fixDef.isSensor = true;
        this.footSensor = this.body.CreateFixture(fixDef);

        //Position the footsensor at the bottom
        for (var v in this.footSensor.m_shape.m_vertices)
            this.footSensor.m_shape.m_vertices[v].y += Physics.pixelToMeters(this.sprite.getFrameHeight() / 2);

    }

}