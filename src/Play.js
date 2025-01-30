class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;
        this.wall_velocity = 200;
        this.shot_counter = 0;
        this.score = 0;
        this.shot_percent = 0;
    }

    preload() {
        this.load.path = "./assets/img/";
        this.load.image("grass", "grass.jpg");
        this.load.image("cup", "cup.jpg");
        this.load.image("ball", "ball.png");
        this.load.image("wall", "wall.png");
        this.load.image("oneway", "one_way_wall.png");
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, "grass").setOrigin(0);

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, "cup");
        this.cup.body.setCircle(this.cup.width / 4);
        this.cup.body.setOffset(this.cup.width / 4);
        this.cup.body.setImmovable(true);
        // add ball
        this.ball = this.physics.add.sprite(
            width / 2,
            height - height / 10,
            "ball"
        );
        this.ball.body.setCircle(this.ball.width / 2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);
        // add walls
        this.wallA = this.physics.add.sprite(0, height / 4, "wall");
        this.wallA.setX(
            Phaser.Math.Between(
                0 + this.wallA.width / 2,
                width - this.wallA.width / 2
            )
        );
        this.wallA.body.setImmovable(true);

        this.wallB = this.physics.add.sprite(0, height / 2, "wall");
        this.wallB.setX(
            Phaser.Math.Between(
                0 + this.wallB.width / 2,
                width - this.wallB.width / 2
            )
        );
        this.wallB.body.setImmovable(true);

        this.walls = this.add.group([this.wallA, this.wallB]);

        this.wallA.setVelocityX(this.wall_velocity);

        // add one-way
        this.oneWay = this.physics.add.sprite(0, (height / 4) * 3, "oneway");
        this.oneWay.setX(
            Phaser.Math.Between(
                0 + this.oneWay.width / 2,
                width - this.oneWay.width / 2
            )
        );

        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;
        // add pointer input
        this.input.on("pointerdown", (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1;
            this.ball.body.setVelocityX(
                Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X)
            );
            this.ball.body.setVelocityY(
                Phaser.Math.Between(
                    this.SHOT_VELOCITY_Y_MIN,
                    this.SHOT_VELOCITY_Y_MAX
                ) * shotDirection
            );
            this.shot_counter += 1;
            this.counter_txt.text = "shots: " + this.shot_counter;
            this.percent_txt.text =
                "percent: " + this.score / this.shot_counter;
        });
        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            // ball.destroy();
            // reset ball after scoring
            this.ball.setPosition(width / 2, height - height / 10);
            this.score += 1;
            this.score_txt.text = "score: " + this.score;
            this.percent_txt.text =
                "percent: " + this.score / this.shot_counter;
        });
        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls);
        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay);

        this.scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 200,
        };
        this.counter_txt = this.add
            .text(
                width / 6,
                25,
                "shots: " + this.shot_counter,
                this.scoreConfig
            )
            .setOrigin(0.5);
        this.score_txt = this.add
            .text(width / 2, 25, "score: " + this.score, this.scoreConfig)
            .setOrigin(0.5);
        this.percent_txt = this.add
            .text(
                (width / 6) * 5,
                25,
                "percent:" + this.shot_percent,
                this.scoreConfig
            )
            .setOrigin(0.5);
    }

    update() {
        // console.log(this.wallA.x);
        if (this.wallA.x >= width - this.wallA.width / 2) {
            this.wallA.setVelocityX(-this.wall_velocity);
        }
        if (this.wallA.x <= 0 + this.wallA.width / 2) {
            this.wallA.setVelocityX(this.wall_velocity);
        }
    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[DONE] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[DONE] Make one obstacle move left/right and bounce against screen edges
[DONE] Create and display shot counter, score, and successful shot percentage
*/
