var game = (function(){
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
  
    var player = {
      x:0,
      y:475,
      h: 25,
      w: 25,
      fill: '#C0C0C0',
      dir: 'right',
      speed: 5
    }
  
    var spawn = {
      x: 50,
      y: 0,
      h: 10,
      w: 10,
      fill: '#2F4F4F',
      speed: 5
    }
  
    var spawns = {}
  
    var spawner = null;
  
    var animation  = null;
  
    var gameOver = false;
  
    //1. Create a variable to hold the score
    var score = 0;
  
  
    function launchSpawns(){
      spawner = setInterval(()=>{
  
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";
  
        for (var i = 0; i < 10; i++){
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
  
        spawns[text] = {
          x:Math.floor(Math.random()*this.canvas.width),
          y:spawn.y,
          h:spawn.h,
          w:spawn.w,
          fill:spawn.fill,
          speed:5,
        }
  
      },400);
    }
  
  
  
    return {
      moveSpawns: function(){
  
        if(Object.keys(spawns).length>0){
          for(let spawn in spawns){
  
            if(spawns[spawn].y<=canvas.height){
  
  
              ctx.fillStyle = spawns[spawn].fill;
  
  
              ctx.save();
  
              ctx.clearRect(
                spawns[spawn].x-1,
                spawns[spawn].y-spawns[spawn].speed,
                spawns[spawn].w+2,
                spawns[spawn].h+2
              );
  
              ctx.fillRect(
                spawns[spawn].x,
                spawns[spawn].y = (spawns[spawn].y+spawns[spawn].speed),
                spawns[spawn].w,
                spawns[spawn].h
              );
  
              ctx.restore();
  
              if (
                player.x < spawns[spawn].x + spawns[spawn].w &&
                spawns[spawn].x > player.x && spawns[spawn].x < (player.x + player.w) &&
                player.y < spawns[spawn].y + spawns[spawn].h &&
                player.y + player.h > spawns[spawn].y
              ){
                gameOver = true;
                cancelAnimationFrame(animation);
                clearInterval(spawner);
              }
  
            }else{
              //2. Increment the score when any time
              //an enemy sprite move off screen
              score = score + 10;
              //3. Write the score to a separate div
              document.getElementById('score').innerHTML = score;
              delete spawns[spawn];
            }
          }
        }
  
      },
  
      player: function(){
        ctx.fillStyle=player.fill;
  
        if(player.dir === 'right'){
  
          ctx.clearRect(
            player.x-player.speed,
            player.y-1,
            player.w+2,
            player.h+2
          );
  
          ctx.fillRect(
            player.x = (player.x + player.speed),
            player.y,
            player.w,
            player.h
          );
  
          if((player.x + player.w) >= canvas.width){
            player.dir = 'left';
          }
  
        }else{
  
          ctx.clearRect(
            player.x+player.speed,
            player.y-1,
            player.w+2,
            player.h+2
          );
  
          ctx.fillRect(
            player.x = (player.x - player.speed),
            player.y,
            player.w,
            player.h
          );
  
          if(player.x <= 0){
            player.dir = 'right';
          }
        }
      },
  
      changeDirection: function(){
        if(player.dir === 'left'){
          player.dir = 'right';
        }else if(player.dir === 'right'){
          player.dir = 'left';
        }
      },
  
      animate: function(){
        this.player();
        this.moveSpawns();
        if(gameOver===false){
          animation = window.requestAnimationFrame(this.animate.bind(this));
        }
  
      },
  
      init: function(){
        canvas.height = 600;
        canvas.width = 800;
  
        launchSpawns();
        this.animate();
      }
    }
  })();
  
  game.init();
  
  window.addEventListener('keyup', function(){
    game.changeDirection();
  });
  