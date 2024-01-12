function commonCreate(scene) {
  // Setting up the scene
  scene.active = true;
  scene.physics.world.setBounds(0, 0, 375, 800);
  // Adding background
  scene.bg = scene.add.image(0, 0, 'bg').setScale(5);
  scene.bg.setOrigin(0, 0);
  // Adding text

  // Adding floor
   scene.floor = scene.physics.add.staticGroup({
    collideWorldBounds: true,
    key: 'block',
    repeat: 12,
    setXY: { x: 16, y: 784, stepX: 32 },
  });

  
      
}
function scoreText(){
  // Generate score text
    this.scoreText = this.add.text(300, 50, this.score, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '20px',
      color: '#ffffff'
    });
    this.scoreText.setScrollFactor(0);
}

function createPlatform(scene, x, y, size, tile, stepX, stepY) {
  // Create a static group of platforms from a tile sprite
    const platform = scene.physics.add.staticGroup({
      key: tile,
      repeat: size,
      setXY: { x: x, y: y, stepX: stepX, stepY: stepY },
    });
    return platform;
}

function createSpikes(scene, x, y, size, tile, stepX, stepY) {
  // Create a static group of platforms from a tile sprite
    const spike = scene.physics.add.staticGroup({
      key: tile,
      repeat: size,
      setXY: { x: x, y: y, stepX: stepX, stepY: stepY },
    });
    return spike;
}
  

function createAnimations(scene) {
  // Adding animations to the player
    scene.anims.create({
      key: 'idle',
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
      frameRate:  4,
      repeat: 1
    });

    scene.anims.create({
      key: 'right',
      frames: scene.anims.generateFrameNumbers('run', { start: 0, end: 11 }),
      frameRate:  10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'left',
      frames: scene.anims.generateFrameNumbers('run', { start: 0, end: 11 }),
      frameRate:  10,
      repeat: -1,
    });

    scene.anims.create({
      key: 'jump',
      frames: scene.anims.generateFrameNumbers('jump', { start: 0, end: 0 }),
      frameRate:  1,
    });
    // Adding animations to the fan
    scene.anims.create({
      key: 'fan',
      frames: scene.anims.generateFrameNumbers('fan', { start: 0, end: 3 }),
      frameRate: 1,
      repeat: -1,
  });
}

function createPatrollingEnemy(scene, x, y, spriteKey, patrolDistance, patrolDuration) {
    // Create an enemy sprite and make it patrol back and forth
  const enemy = scene.add.sprite(x, y, spriteKey);
    scene.physics.add.existing(enemy);
    

    scene.tweens.add({
      targets: enemy,
      x: x + patrolDistance, 
      ease: 'Linear',
      duration: patrolDuration,
      yoyo: true,
      repeat: -1, 
    });
    return enemy;
}

function handlePlayerMovement(player, cursors) {
  // Player movement controls
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-430);
      player.anims.play('jump', true);
    } 
    else if (cursors.down.isDown) {
      player.setVelocityY(160);
      player.anims.play('idle', true);
    }
    else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.setFlipX(false);
      player.anims.play('right', true);
    }
    else if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.setFlipX(true);
      player.anims.play('left', true);
    }

    else {
      player.setVelocityX(0);
      player.anims.play('idle');
    }
}
function createFan(scene, x, y, key) {
  // Create a fan sprite 
    const fan = scene.physics.add.sprite(x, y, key);
    fan.setCollideWorldBounds(true);
    fan.anims.play('fan', true);
  
    return fan;
}
function blownByFan(scene, player, fan) {    
  // If the player is above the fan, blow them upwards
    if (player.y < fan.y) {
      player.setVelocityY(-500);
    }
}

function createCollectable(scene, x, y, key, repeat, stepX, stepY) {
  // Create a group of collectables from a sprite
    return scene.physics.add.group({
      collideWorldBounds: true,
      key: key,
      repeat: repeat,
      setXY: { x: x, y: y, stepX: stepX, stepY: stepY },
    }); 
}
  
function destroyAndRespawnBlocks(scene, player, blocks) {
  // Destroy and respawn blocks after a delay when the player touches them
    scene.physics.add.collider(player, blocks, (player, block) => {
      // Destroy the block  after 2 seconds      
      scene.time.delayedCall(2000, () => {
        block.disableBody(true, true);
      })
      // Respawn the block after 3 seconds
      scene.time.delayedCall(3000, () => {
        block.enableBody(true, block.x, block.y, true, true);
      });
    });
}

function death(scene) {
    // Create particle emitter
    const particles = scene.add.particles('blood_particle');

    // Set up emitter configuration
    const emitter = particles.createEmitter({
      x: scene.player.x,
      y: scene.player.y,
      speed: { min: -100, max: 100 },
      quantity: 50,
      scale: { start: 0.4, end: 0 },
      lifespan: 1000,
    });
    scene.player.disableBody(true, true);

    // Start the particle emitter
    emitter.explode();

    // Delay for a moment before restarting the scene
    scene.time.delayedCall(1000, () => {
      // Stop the particle emitter
      particles.destroy();
      
      // Restart the scene and reset the score
      scene.scene.restart();
      scene.score = 0;
    }, [], scene);
}
function collect (scene, player, collectable)
// Collect the collectable and update the score
  {
      collectable.disableBody(true, true);
      collectable.destroy();
      
      
    // Update Score
    scene.score++;
    scene.scoreText.setText(scene.score);
}

// Main menu
class MainMenu extends Phaser.Scene {
  constructor() {
    super({key: 'MainMenu'});
    
  } 

  preload() {
    this.load.image('bg', 'assets/background/bg.png');
    this.load.image('play', 'assets/Menu/Buttons/Play.png');
    
  }

  create() {
    this.bg = this.add.image(0, 0, 'bg').setScale(5);
    this.add.text(120, 100, 'Skyward', { fontSize: '32px', fill: 'black' });
    

    this.add.image(187.5, 500, 'play').setScale(4).setInteractive().on('pointerdown', () => {
      this.scene.start('LevelMenu');
      
    }
    );
  }

  update() {

  }


}
// Level select menu
class LevelMenu extends Phaser.Scene {
  constructor() {
    super({key: 'LevelMenu'});
    
  } 

  preload() {
    this.load.image('bg', 'assets/background/bg.png');
    this.load.image('level1', 'assets/Menu/Levels/01.png');
    this.load.image('level2', 'assets/Menu/Levels/02.png');
    this.load.image('level3', 'assets/Menu/Levels/03.png');
    this.load.image('level4', 'assets/Menu/Levels/04.png');
    this.load.image('tutorial', 'assets/Menu/Levels/tutorial.png');
    
  }

  create() {
    this.bg = this.add.image(0, 0, 'bg').setScale(5);
    this.add.text(0, 100, 'Select a level to play', { fontSize: '28px', fill: 'black'});
    
  }

  update() {
    this.add.image(187, 600, 'tutorial').setScale(0.2).setInteractive().on('pointerdown', () => {
      this.scene.start('Tutorial');
      
    }
    );
    this.add.image(50, 525, 'level1').setScale(3).setInteractive().on('pointerdown', () => {
      this.scene.start('Level1');
      
    }
    );
    this.add.image(135, 525, 'level2').setScale(3).setInteractive().on('pointerdown', () => {
      this.scene.start('Level2');
      
    }
    );
    this.add.image(230, 525, 'level3').setScale(3).setInteractive().on('pointerdown', () => {
      this.scene.start('Level3');
      
    }
    );
    this.add.image(325, 525, 'level4').setScale(3).setInteractive().on('pointerdown', () => {
      this.scene.start('Level4');
      
    }
    );
  }


}
// Tutorial Level
class Tutorial extends Phaser.Scene {
  constructor(player, score) {
    super({ key:'Tutorial'});
    // Class variables
    this.player = player;
    this.score = 0;
  }
  
  completeLevel() {
    this.scene.start('MainMenu');
  }

  preload() {
    // Loading assets before the scene starts
    this.load.image('bg', 'assets/background/bg.png');
      
    this.load.image('blood_particle', 'assets/particles/blood_particle.png');
    this.load.image('block', 'assets/terrain/tile003.png');
    this.load.spritesheet('player', 'assets/player/Idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('run', 'assets/player/Run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('jump', 'assets/player/Jump.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('apples', 'assets/collectables/Apple.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image('spiked-ball', 'assets/Traps/Spiked-Ball/Spiked-Ball.png')
    this.load.image('spike', 'assets/Traps/Spikes/Spikes.png');

    this.load.image('crumbling-block', 'assets/terrain/tile018.png');
    this.load.spritesheet('fan', 'assets/Traps/Fan/Fan.png', {
      frameWidth: 24,
      frameHeight: 8})

    this.load.image('trophy', 'assets/Checkpoint/Trophy.png');

  }

  create() {

    commonCreate(this);
    // Adding animations
    createAnimations(this);
    
    // Adding spikes
    this.spikes = [];
    this.spikes.push(createSpikes(this, 250, 475, 3, 'spike', 8, 0));
    // Adding player
    
    this.player = this.physics.add.sprite(20, 740, 'player');
    this.player.setCollideWorldBounds(true);
    
    // Adding fan
    this.fan = []
    this.fan.push(createFan(this, 200, 280, 'fan'));
    // Adding platforms
    this.platforms = [];
    this.platforms.push(createPlatform(this, 150, 700, 5, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 0, 600, 5, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 150, 500, 5, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 150, 300, 5, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 300, 175, 2, 'block', 32, 0));

    // Tutorial Text
    this.add.text(120, 620, 'Collect the apples to increase your score', {fontSize: "10px", fill: "#ffffff"});
    this.add.text(20, 520, 'Avoid patrolling enemies', {fontSize: "10px", fill: "#ffffff"});
    this.add.text(170, 420, 'Avoid floor spikes', {fontSize: "10px", fill: "#ffffff"});
    this.add.text(20, 320, 'Move quickly on crumbling platforms to avoid falling', {fontSize: "10px", fill: "#ffffff"});
    this.add.text(10, 220, 'Use fans to reach high places your character cant jump to', {fontSize: "10px", fill: "#ffffff"});
    

    // this.platforms.push(createPlatform(this, 300, 600, 3, 'floor', 32, 0));
    this.crumblingPlatforms = [];
    this.crumblingPlatforms.push(createPlatform(this, 0, 400, 5, 'crumbling-block', 32, 0));
    // Adding enemies
    this.enemies = [];
    this.enemies.push(createPatrollingEnemy(this, 0, 500, 'spiked-ball', 100, 2000));
    // Adding collectibles
    this.collectablesGroup = [];
    this.collectablesGroup.push(createCollectable(this, 200, 670, 'apples',3, 32, 0));
    // Adding score text to the top right of the screen
    scoreText.call(this);
    // Adding trophy
    this.trophy = this.physics.add.staticGroup({
      key: 'trophy',
      repeat: 0,
      setXY: { x: 350, y: 128, stepX: 0, stepY: 0 },
    });
    // Adding camera
    this.cam = this.cameras.main.setSize(375, 650);
    this.cam.setBounds(0, 0, 375, 800);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cam.startFollow(this.player);
  }

  update() {
    // Player Movement
    handlePlayerMovement(this.player, this.cursors);
    // Collision
    
    // Platform Collision
    this.physics.add.collider(this.player, this.floor);
    this.platforms.forEach((platform) => {
      this.physics.add.collider(this.player, platform);
    });
    // Enemy Collision
    this.enemies.forEach((enemy) => {
      this.physics.add.collider(this.floor, enemy);
      this.physics.add.collider(this.platforms, enemy);
    });
    this.physics.add.overlap(this.player, this.enemies, () =>death(this), null, this);
    // Collectible Collision
    this.physics.add.collider(this.collectablesGroup, this.floor);
    this.physics.add.collider(this.collectablesGroup, this.platforms);
    this.physics.add.overlap(this.player, this.collectablesGroup, (player, collectable) => collect(this, player, collectable), null, this);
    
    // Spike Collision
    this.physics.add.overlap(this.player, this.spikes, () =>death(this), null, this);

    // Fan Collision
    this.fan.forEach((fan) => {
      this.physics.add.collider(this.platforms, fan);
      this.physics.add.collider(this.floor, fan);
      this.physics.add.overlap(this.player, fan, () => {blownByFan(this, this.player, fan);}, null, this);
    })
    // Crumbling platform collision
    this.crumblingPlatforms.forEach(() => {
      destroyAndRespawnBlocks(this, this.player, this.crumblingPlatforms);
    });
    // Trophy Collision
    this.physics.add.collider(this.platforms, this.trophy);
    this.physics.add.overlap(this.player, this.trophy, () => this.completeLevel(), null, this);
  }


}
// Level 1
class Level1 extends Phaser.Scene {
  constructor(player, score) {
    super({ key:'Level1'});
    // Class variables
    this.player = player;
    this.score = 0;
  }
  
  completeLevel() {
    this.scene.start('Level2');
  }

  preload() {
    this.load.image('bg', 'assets/background/bg.png');
      
    this.load.image('blood_particle', 'assets/particles/blood_particle.png');
    this.load.image('block', 'assets/terrain/tile003.png');
    this.load.spritesheet('player', 'assets/player/Idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('run', 'assets/player/Run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('jump', 'assets/player/Jump.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('apples', 'assets/collectables/Apple.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image('spiked-ball', 'assets/Traps/Spiked-Ball/Spiked-Ball.png')
    this.load.image('spike', 'assets/Traps/Spikes/Spikes.png');

    this.load.image('crumbling-block', 'assets/terrain/tile018.png');
    this.load.spritesheet('fan', 'assets/Traps/Fan/Fan.png', {
      frameWidth: 24,
      frameHeight: 8
    })

    this.load.image('trophy', 'assets/Checkpoint/Trophy.png');
  }

  create() {
    commonCreate(this);
    // Adding animations
    createAnimations(this);
    // Adding player
    
    this.player = this.physics.add.sprite(20, 750, 'player');
    this.player.setCollideWorldBounds(true);
    // Adding platforms
    this.platforms = [];
    this.platforms.push(createPlatform(this, 300, 700, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 200, 600, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 100, 500, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 200, 400, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 300, 300, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 150, 200, 2, 'block', 32, 0));

    // Adding collectibles
    this.collectablesGroup = [];
    this.collectablesGroup.push(createCollectable(this, 150, 750, 'apples',3, 32, 0));
    this.collectablesGroup.push(createCollectable(this, 200, 350, 'apples',2, 32, 0));

    // Adding score text to the top right of the screen
    scoreText.call(this);
    // Adding trophy
    this.trophy = this.physics.add.staticGroup({
      key: 'trophy',
      repeat: 0,
      setXY: { x: 150, y: 152, stepX: 0, stepY: 0 },
    });
    // Adding camera
    this.cam = this.cameras.main.setSize(375, 650);
    this.cam.setBounds(0, 0, 375, 800);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cam.startFollow(this.player);
  }

  update() {
    // Player Movement
    handlePlayerMovement(this.player, this.cursors);
    // Collision
    
    // Platform Collision
    this.physics.add.collider(this.player, this.floor);
    this.platforms.forEach((platform) => {
      this.physics.add.collider(this.player, platform);
    });
    // Collectible Collision
    this.physics.add.collider(this.collectablesGroup, this.floor);
    this.physics.add.collider(this.collectablesGroup, this.platforms);
    this.physics.add.overlap(this.player, this.collectablesGroup, (player, collectable) => collect(this, player, collectable), null, this);
    // Trophy Collision
    this.physics.add.collider(this.platforms, this.trophy);
    this.physics.add.overlap(this.player, this.trophy, () => this.completeLevel(), null, this);
  }


}

// Level 2
class Level2 extends Phaser.Scene {
  constructor(player, score) {
    super({ key:'Level2'});
    this.player = player;
    this.score = 0;
  }
  completeLevel() {
    this.scene.start('Level3');
  }
  preload() {
    this.load.image('bg', 'assets/background/bg.png');
      
    this.load.image('blood_particle', 'assets/particles/blood_particle.png');
    this.load.image('block', 'assets/terrain/tile003.png');
    this.load.spritesheet('player', 'assets/player/Idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('run', 'assets/player/Run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('jump', 'assets/player/Jump.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('apples', 'assets/collectables/Apple.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image('spiked-ball', 'assets/Traps/Spiked-Ball/Spiked-Ball.png')
    this.load.image('spike', 'assets/Traps/Spikes/Spikes.png');

    this.load.image('crumbling-block', 'assets/terrain/tile018.png');
    this.load.spritesheet('fan', 'assets/Traps/Fan/Fan.png', {
      frameWidth: 24,
      frameHeight: 8})

    this.load.image('trophy', 'assets/Checkpoint/Trophy.png');

  }
  create() {
    commonCreate(this);
    createAnimations(this);
    this.player = this.physics.add.sprite(20, 750, 'player');
    this.player.setCollideWorldBounds(true);
      // Level 2 spikes
      this.spikes = []
      this.spikes.push(createSpikes(this, 75, 375, 3, 'spike', 16, 0));
      // Level 2 platforms
      this.platforms = [];
      
    this.platforms.push(createPlatform(this, 150, 700, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 150, 600, 1, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 250, 500, 4, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 200, 400, 1, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 50, 400, 3, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 0, 300, 0, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 100, 200, 2, 'block', 32, 0));

      // Level 2 enemies
      this.enemies = [];
      this.enemies.push(createPatrollingEnemy(this, 225, 450, 'spiked-ball', 120, 2000));
      // Level 2 collectables
      this.collectablesGroup = [];
      this.collectablesGroup.push(createCollectable(this, 250, 430, 'apples',3, 32, 0));
      this.collectablesGroup.push(createCollectable(this, 160, 540, 'apples',1, 32, 0));
      // Level 2 trophy
      this.trophy = this.physics.add.staticGroup({
        key: 'trophy',
        repeat: 0,
        setXY: { x: 100, y: 152, stepX: 0, stepY: 0 },
      });
    // Adding score text to the top right of the screen
    scoreText.call(this);
      this.cam = this.cameras.main.setSize(375, 650);
      this.cam.setBounds(0, 0, 375, 800);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.cam.startFollow(this.player);
  }

  update() {
    handlePlayerMovement(this.player, this.cursors);
    // Platform Collision
    this.physics.add.collider(this.player, this.floor);
    this.platforms.forEach((platform) => {
      this.physics.add.collider(this.player, platform);
    });
    // Enemy Collision
    this.enemies.forEach((enemy) => {
      this.physics.add.collider(this.floor, enemy);
      this.physics.add.collider(this.platforms, enemy);
    });
    this.physics.add.overlap(this.player, this.enemies, () =>death(this), null, this);
    // Collectible Collision
    this.physics.add.collider(this.collectablesGroup, this.floor);
    this.physics.add.collider(this.collectablesGroup, this.platforms);
    
    this.physics.add.overlap(this.player, this.collectablesGroup, (player, collectable) => collect(this, player, collectable), null, this);
    
    // Spike Collision
    this.physics.add.overlap(this.player, this.spikes, () =>death(this), null, this);

    // Trophy Collision
    this.physics.add.collider(this.platforms, this.trophy);
    this.physics.add.overlap(this.player, this.trophy, () => this.completeLevel(), null, this);
  
  }
}
// Level 3
class Level3 extends Phaser.Scene {
  constructor(player, score) {
    super({ key:'Level3'});
    this.player = player;
    this.score = 0;
  }
  completeLevel() {
    this.scene.start('Level4');
  }
  preload() {
    this.load.image('bg', 'assets/background/bg.png');
      
    this.load.image('blood_particle', 'assets/particles/blood_particle.png');
    this.load.image('block', 'assets/terrain/tile003.png');
    this.load.spritesheet('player', 'assets/player/Idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('run', 'assets/player/Run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('jump', 'assets/player/Jump.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('apples', 'assets/collectables/Apple.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image('spiked-ball', 'assets/Traps/Spiked-Ball/Spiked-Ball.png')
    this.load.image('spike', 'assets/Traps/Spikes/Spikes.png');

    this.load.image('crumbling-block', 'assets/terrain/tile018.png');
    this.load.spritesheet('fan', 'assets/Traps/Fan/Fan.png', {
      frameWidth: 24,
      frameHeight: 8})

    this.load.image('trophy', 'assets/Checkpoint/Trophy.png');

  }
  create() {
    commonCreate(this);
    createAnimations(this);
    this.player = this.physics.add.sprite(20, 750, 'player');
    this.player.setCollideWorldBounds(true);
      // Level 2 spikes
      this.spikes = []
      this.spikes.push(createSpikes(this, 150, 205, 3, 'spike', 16, 0));

      // Level 2 platforms
      this.platforms = [];
      
    this.platforms.push(createPlatform(this, 300, 650, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 150, 550, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 100, 450, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 200, 350, 2, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 300, 250, 1, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 100, 230, 4, 'block', 32, 0));
    this.platforms.push(createPlatform(this, 0, 150, 2, 'block', 32, 0));

      // Level 2 fans 
      this.fan = [];
      this.fan.push(createFan(this, 250, 750, 'fan'));

      // Level 2 collectables
      this.collectablesGroup = [];
      this.collectablesGroup.push(createCollectable(this, 110, 400, 'apples',2, 32, 0));
      this.collectablesGroup.push(createCollectable(this, 290, 600, 'apples',1, 32, 0));

      // Level 2 trophy
      this.trophy = this.physics.add.staticGroup({
        key: 'trophy',
        repeat: 0,
        setXY: { x: 20, y: 105, stepX: 0, stepY: 0 },
      });
    // Adding score text to the top right of the screen
    scoreText.call(this);
      this.cam = this.cameras.main.setSize(375, 650);
      this.cam.setBounds(0, 0, 375, 800);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.cam.startFollow(this.player);
  }

  update() {
    handlePlayerMovement(this.player, this.cursors);
    // Platform Collision
    this.physics.add.collider(this.player, this.floor);
    this.platforms.forEach((platform) => {
      this.physics.add.collider(this.player, platform);
    });

    this.physics.add.overlap(this.player, this.enemies, () =>death(this), null, this);
    // Collectible Collision
    this.physics.add.collider(this.collectablesGroup, this.floor);
    this.physics.add.collider(this.collectablesGroup, this.platforms);
    this.physics.add.overlap(this.player, this.collectablesGroup, (player, collectable) => collect(this, player, collectable), null, this);
    
    // Spike Collision
    this.physics.add.overlap(this.player, this.spikes, () =>death(this), null, this);

    // Fan Collision
    this.fan.forEach((fan) => {
      this.physics.add.collider(this.platforms, fan);
      this.physics.add.collider(this.floor, fan);
      this.physics.add.overlap(this.player, fan, () => {blownByFan(this, this.player, fan);}, null, this);
    })

    // Trophy Collision
    this.physics.add.collider(this.platforms, this.trophy);
    this.physics.add.overlap(this.player, this.trophy, () => this.completeLevel(), null, this);
  
  }
}
// Level 4
class Level4 extends Phaser.Scene {
  constructor(player, score) {
    super({ key:'Level4'});
    this.player = player;
    this.score = 0;
  }
  gameComplete() { 
    this.scene.start('MainMenu');
  }
  preload() {
    this.load.image('bg', 'assets/background/bg.png');
      
    this.load.image('blood_particle', 'assets/particles/blood_particle.png');
    this.load.image('block', 'assets/terrain/tile003.png');
    this.load.spritesheet('player', 'assets/player/Idle.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('run', 'assets/player/Run.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('jump', 'assets/player/Jump.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('apples', 'assets/collectables/Apple.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image('spiked-ball', 'assets/Traps/Spiked-Ball/Spiked-Ball.png')
    this.load.image('spike', 'assets/Traps/Spikes/Spikes.png');

    this.load.image('crumbling-block', 'assets/terrain/tile018.png');
    this.load.spritesheet('fan', 'assets/Traps/Fan/Fan.png', {
      frameWidth: 24,
      frameHeight: 8})

    this.load.image('trophy', 'assets/Checkpoint/Trophy.png');

  }
  create() {
    commonCreate(this);
    createAnimations(this);
    this.player = this.physics.add.sprite(20, 750, 'player');
    this.player.setCollideWorldBounds(true);

      // Level 2 spikes
      this.spikes = []
      this.spikes.push(createSpikes(this, 125, 175, 3, 'spike', 8, 0));
      // Level 2 platforms
      this.platforms = [];
      
      this.platforms.push(createPlatform(this, 150, 700, 1, 'block', 32, 0));
      this.platforms.push(createPlatform(this, 220, 650, 1, 'block', 32, 0));
      this.platforms.push(createPlatform(this, 300, 550, 1, 'block', 32, 0));
      this.platforms.push(createPlatform(this, 0, 400, 1, 'block', 32, 0));
      this.platforms.push(createPlatform(this, 220, 250, 0, 'block', 32, 0));
      this.platforms.push(createPlatform(this, 80, 200, 3, 'block', 32, 0));

      // Level 2 collectables
      this.collectablesGroup = [];
      this.collectablesGroup.push(createCollectable(this, 100, 450, 'apples',3, 32, 0));
      this.collectablesGroup.push(createCollectable(this, 200, 340, 'apples',2, 32, 0));
      // Level 2 crumbling platforms
      this.crumblingPlatforms = [];
      this.crumblingPlatforms.push(createPlatform(this, 100, 500, 3, 'crumbling-block', 32, 0));
      this.crumblingPlatforms.push(createPlatform(this, 200, 370, 2, 'crumbling-block', 32, 0));
      this.crumblingPlatforms.push(createPlatform(this, 300, 280, 2, 'crumbling-block', 32, 0));

    
      // Level 2 trophy
      this.trophy = this.physics.add.staticGroup({
        key: 'trophy',
        repeat: 0,
        setXY: { x: 80, y: 152, stepX: 0, stepY: 0 },
      });
    // Adding score text to the top right of the screen
    scoreText.call(this);
      this.cam = this.cameras.main.setSize(375, 650);
      this.cam.setBounds(0, 0, 375, 800);
      this.cursors = this.input.keyboard.createCursorKeys();
      this.cam.startFollow(this.player);
  }

  update() {
    // Player Movement
    handlePlayerMovement(this.player, this.cursors);
    // Platform Collision
    this.physics.add.collider(this.player, this.floor);
    this.platforms.forEach((platform) => {
      this.physics.add.collider(this.player, platform);
    });

    this.physics.add.overlap(this.player, this.enemies, () =>death(this), null, this);
    // Collectible Collision
    this.physics.add.collider(this.collectablesGroup, this.floor);
    this.physics.add.collider(this.collectablesGroup, this.crumblingPlatforms);
    this.physics.add.overlap(this.player, this.collectablesGroup, (player, collectable) => collect(this, player, collectable), null, this);
    
    // Spike Collision
    this.physics.add.overlap(this.player, this.spikes, () =>death(this), null, this);

    // Crumbling platform collision
    this.crumblingPlatforms.forEach(() => {
      destroyAndRespawnBlocks(this, this.player, this.crumblingPlatforms);
    });
    // Trophy Collision
    this.physics.add.collider(this.platforms, this.trophy);
    this.physics.add.overlap(this.player, this.trophy, () => this.gameComplete(), null, this);
  
  }
}

const config = {
  type: Phaser.AUTO,
  width: 375,
  height: 650,
  parent: 'game-container',
  scene: [MainMenu,LevelMenu,Tutorial,Level1,Level2, Level3, Level4 ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900 },
    },
  },
};

const game = new Phaser.Game(config);