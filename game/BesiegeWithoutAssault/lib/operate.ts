import * as coordinate from './coordinate.ts';
import * as preset from './preset.ts';
export function initialize(you:coordinate.Coordinate,enemy:coordinate.Coordinate,you_x:number,you_y:number){
	enemy.x=enemy.y=0;
	you.x=you_x;
	you.y=you_y;
	console.log(`your place: (${you.x.toPrecision(8)},${you.y.toPrecision(8)}); enemy's place: (${enemy.x.toPrecision(8)},${enemy.y.toPrecision(8)})`)
}
export function move(you:coordinate.Coordinate,enemy:coordinate.Coordinate,length:number,dest_x:number,dest_y:number):[int,coordinate.Coordinate,coordinate.Coordinate,number]{
	const your_dir=new coordinate.Coordinate(dest_x,dest_y).subtract(you);
	const your_dir_slice=your_dir.multiply(1/10000);
	const your_dir_slice_len=your_dir_slice.norm();
	const enemy_dir_slice_len:number=your_dir_slice_len*preset.EnemySpeedRate;
	if(your_dir_slice_len>1e-14){
		for(let _=0;_<10000;_++){
			const enemy_dir_slice=enemy.subtract(you).normalize().multiply(enemy_dir_slice_len);
			you=you.add(your_dir_slice);
			enemy=enemy.add(enemy_dir_slice);
			length+=enemy_dir_slice_len;
			if(enemy.subtract(you).norm()<1){
				console.log(`Failed: too close!`)
				console.log(`your place: (${you.x.toPrecision(8)},${you.y.toPrecision(8)}); enemy's place: (${enemy.x.toPrecision(8)},${enemy.y.toPrecision(8)}) length: ${length}`)
				return [1,null,null,null];
			}
			if(enemy.norm()>10){
				console.log(`Failed: out of range!`)
				console.log(`your place: (${you.x.toPrecision(8)},${you.y.toPrecision(8)}); enemy's place: (${enemy.x.toPrecision(8)},${enemy.y.toPrecision(8)}) length: ${length}`)
				return [2,null,null,null];
			}
			if(length>preset.Goal){
				console.log(`Successed!`)
				console.log(`your place: (${you.x.toPrecision(8)},${you.y.toPrecision(8)}); enemy's place: (${enemy.x.toPrecision(8)},${enemy.y.toPrecision(8)}) length: ${length}`)
				return [0,you,enemy,length];
			}
		}
	}
	console.log(`your place: (${you.x.toPrecision(8)},${you.y.toPrecision(8)}); enemy's place: (${enemy.x.toPrecision(8)},${enemy.y.toPrecision(8)}) length: ${length}`)
	return [0,you,enemy,length];
}
