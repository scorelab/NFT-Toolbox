export class ProgressBar {
	title: string;
	total: number;
	current: number;
	bar_length: number;

	constructor(title: string, total: number) {
		this.title = title;
		this.total = total;
		this.current = 0;
		const totLen = process.stdout.columns;
		this.bar_length = totLen - 40 - ((totLen - 40) % 10);
	}

	init() {
		this.current = 0;
		this.update(this.current);
	}

	update(current: number) {
		this.current = current;
		const current_progress = this.current / this.total;
		this.draw(current_progress);
	}

	private draw(current_progress: number) {
		const filled_bar_length = current_progress * this.bar_length;
		const empty_bar_length = this.bar_length - filled_bar_length;
		const filled_bar = "#".repeat(filled_bar_length);
		const empty_bar = "-".repeat(empty_bar_length);
		const percentage_progress = (current_progress * 100).toFixed(2);

		process.stdout.clearLine(1);
		process.stdout.cursorTo(0);
		process.stdout.write(
			`${this.title}: [ ${filled_bar}${empty_bar} ] | ${percentage_progress}%`
		);
	}
}
