import p5Types from "p5";

export class Ball {
    public p5obj : p5Types;
    public x : number;
    public y : number;
    public r : number;
    public width_canvas : number;
    public height_canvas : number;
    constructor(p5 : p5Types, x:number, y: number, r: number, width_cav : number, height_cav : number,
        prev_w : number, prev_h : number){
        this.p5obj = p5;
        this.width_canvas = width_cav;
        this.height_canvas = width_cav;
        this.x = x * width_cav / prev_w; 
        this.y = y * height_cav / prev_h;
        this.r = r * width_cav / prev_w;
    }
    show (mode : string){
        if (mode ==  "classic")
        {
            this.p5obj.fill("#e68840");
            this.p5obj.stroke("#e68840");
        }   
        else 
            this.p5obj.fill(0);
        this.p5obj.ellipse(this.x, this.y,this.r*2,this.r*2);
    }
}