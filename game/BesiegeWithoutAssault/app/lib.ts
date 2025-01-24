export const EnemySpeedRate: number = .95;
export const Goal: number = 500;
export const Step = 300

export class Coordinate {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	add(other: Coordinate): Coordinate {
		return new Coordinate(this.x + other.x, this.y + other.y);
	}
	equal(other: Coordinate): boolean {
		return (this.subtract(other).norm() < 1e-10);
	}
	subtract(other: Coordinate): Coordinate {
		return new Coordinate(this.x - other.x, this.y - other.y);
	}
	multiply(scalar: number): Coordinate {
		return new Coordinate(this.x * scalar, this.y * scalar);
	}
	norm(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}
	normalize(): Coordinate {
		const len: number = this.norm();
		return len < 1e-10 ? new Coordinate(0, 0) : this.multiply(1 / len);
	}
}

export async function move(
	you: Coordinate, 
	enemy: Coordinate,
	nx: number,
	ny: number,
	length: number,
	onUpdate?: (you: Coordinate, enemy: Coordinate, delta: number, progress: number) => Promise<void> | void
): Promise<{
	result: 'success' | 'continue' | 'out-of-range' | 'too-close',
	length: number,
	you: Coordinate,
	enemy: Coordinate
}> {
	const your_dir = new Coordinate(nx, ny).subtract(you);
	const your_dir_slice = your_dir.multiply(1 / Step);
	const your_dir_slice_len = your_dir_slice.norm();
	const enemy_dir_slice_len: number = your_dir_slice_len * EnemySpeedRate;
	if (your_dir_slice_len > 1e-14) {
		for (let _ = 0; _ < Step; _++) {
			const enemy_dir_slice = enemy.subtract(you).normalize().multiply(enemy_dir_slice_len);
			you = you.add(your_dir_slice);
			enemy = enemy.add(enemy_dir_slice);
			if (onUpdate) await onUpdate(you, enemy, enemy_dir_slice_len, _ / Step);
			length += enemy_dir_slice_len;
			if (enemy.subtract(you).norm() < 1) {
				return {
					result: 'too-close',
					length,
					you,
					enemy
				}
			}
			if (enemy.norm() > 10) {
				return {
					result: 'out-of-range',
					length,
					you,
					enemy
				}
			}
			if (length >= Goal) {
				return {
					result: 'success',
					length,
					you,
					enemy
				}
			}
		}
	}
	return {
		result: 'continue',
		length,
		you,
		enemy
	}
}
