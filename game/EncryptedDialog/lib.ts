export function generateShuffleMap(): { [key: string]: string } {
	const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
	const shuffled = [...letters];
	shuffled.sort(() => Math.random() - 0.5);
	const shuffleMap: { [key: string]: string } = {};
	for (let i = 0; i < letters.length; i++) {
		shuffleMap[letters[i]] = shuffled[i];
		shuffleMap[letters[i].toUpperCase()] = shuffled[i].toUpperCase();
	}
	return shuffleMap;
}