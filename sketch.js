var population;
var lifespan = 200;
var lifeP;
var count = 0;
var generation = 0;
var target;
var generation_n = 0;
//var generation = 0;
function setup(){
    createCanvas(400, 300);
    population = new Population();
    lifeP = createP();
    generation = createP();
    target = createVector(width/2, 50);
    //rocket = new Rocket();
}


function draw(){
    background(0);
    population.run();
    lifeP.html(count);//lifeP.;
    generation.html(generation_n);
    count++;

    if(count == lifespan){
        //population = new Population(); //every frame 200, reset the population
        population.evaluate();
        population.selection();
        count = 0;
        generation_n++;
    }

    ellipse(target.x, target.y, 16, 16);
}

function Population(){
    this.rockets = [];
    this.popsize = 25;
    this.matingPool = [];

    for(let i = 0; i < this.popsize; i++)
    {
        this.rockets[i] = new Rocket();
    }
    


    this.evaluate = function(){
        var maxfit = 0;
        
        for(var i = 0; i< this.popsize; i++){
            this.rockets[i].calcFitness();
            if(this.rockets[i].fitness > maxfit){
                maxfit = this.rockets[i].fitness;
            }
        }

        
        for(var i = 0; i< this.popsize; i++){
            this.rockets[i].fitness /= maxfit; //normalize the fitness values
            }
        

        this.matingPool = [];

        for(var i = 0; i< this.popsize; i++){
            var n = this.rockets[i].fitness * 100;
            for(var j = 0; j<n; j++){
                this.matingPool.push(this.rockets[i]);
            }
        }
    
    
    }

    this.selection = function(){
        var newRockets = [];
        for(var i = 0; i<this.rockets.length; i++){
        var parentA = random(this.matingPool).dna;//gives a random elemtn forom the array
        var parentB = random(this.matingPool).dna;
        var child = parentA.crossover(parentB);
        child.mutation();
        newRockets[i] = new Rocket(child);
    }
    this.rockets = newRockets;
}

    this.run = function(){
        for(let i = 0; i < this.popsize; i++)
        {
            this.rockets[i].update();
            this.rockets[i].show();
        }
        
    }
}

function DNA(genes){
    if(genes){
        this.genes = genes;
    }
    else{
    this.genes = [];
    for(var i = 0; i<lifespan; i++){
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(0.1);
    }
    }


    this.crossover = function(partner){
        //var mid = 0;
        var newgenes = [];
        var mid = floor(random(this.genes.length));
        for(var i = 0; i<this.genes.length; i++){
            if(i>mid){
                newgenes[i] = this.genes[i];
            } else {
                newgenes[i] = partner.genes[i];
            }
            
        }
        return new DNA(newgenes);
    }

    this.mutation = function(){
        for(var i = 0; i<this.genes.length; i++){
            if(random(1) < .01){
                this.genes[i] = p5.Vector.random2D();
                this.genes[i].setMag(0.1);
            }
        }
    }
}



function Rocket(dna){
    this.pos = createVector(width/2, height);
    this.vel = createVector();
    this.acc = createVector();
    this.completed = false;
    if(dna){
    this.dna = dna;
    } else {
        this.dna = new DNA();
    }
        
        this.fitness = 0;

    this.applyForce = function(force){ //the physics stuff
        this.acc.add(force);
    }


    this.calcFitness = function(){
        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        this.fitness = map(d, 0, width, width, 0);
        if(this.completed){
            this.fitness *=10;
        }
    
    }

    this.update = function(){

        var d = dist(this.pos.x, this.pos.y, target.x, target.y);
        if(d < 10)
        {
            this.completed = true;
            this.pos = target.copy(); //if dist < 10px, boost the score
        }
        this.applyForce(this.dna.genes[count]);
        if(!this.completed){
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }
}
    this.show = function(){
        push();
        noStroke();
        fill(255, 150);
        translate(this.pos.x, this.pos.y);
        rotate(this.vel.heading()); //heading() fxn gives angle of direction of vector
        rectMode(CENTER);
        rect(0, 0, 25, 5);
        
        pop();
    }
    
}