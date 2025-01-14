export class Coordinate{
	x:number;
	y:number;
	constructor(x:number,y:number){
		this.x=x;
		this.y=y;
	}
	add(other:Coordinate):Coordinate{
		return new Coordinate(this.x+other.x,this.y+other.y);
	}
	subtract(other:Coordinate):Coordinate{
		return new Coordinate(this.x-other.x,this.y-other.y);
	}
	multiply(scalar:number):Coordinate{
		return new Coordinate(this.x*scalar,this.y*scalar);
	}
	norm():number{
		return Math.sqrt(this.x**2+this.y**2);
	}
	normalize():Coordinate{
		const len:number=this.norm();
		return len<1e-10?new Coordinate(0,0):this.multiply(1/len);
	}
}
