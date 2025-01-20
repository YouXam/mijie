<template>
    <div>
        <canvas ref="canvas" width="500" height="500" @click="handleCanvasClick"></canvas>
    </div>
</template>

<script>
const colors = [
    ["#f00", "#922"],
    ['#0f0', "#292"]
]
export default {
    data() {
        return {
            points: [],
            intentions: [],
            bufferCanvas: null,
            bufferCtx: null,
            scale: 5,
            size: 500,
            handler: null
        };
    },
    methods: {
        initBuffer() {
            this.$refs.canvas.width = this.size * this.scale;
            this.$refs.canvas.height = this.size * this.scale;
            this.$refs.canvas.style.width = `${this.size}px`;
            this.$refs.canvas.style.height = `${this.size}px`;
            this.bufferCanvas = document.createElement('canvas');
            this.bufferCanvas.width = this.$refs.canvas.width;
            this.bufferCanvas.height = this.$refs.canvas.height;
            this.bufferCtx = this.bufferCanvas.getContext('2d');
            this.drawCoordinateSystem();
        },
        drawCoordinateSystem() {
            const ctx = this.bufferCtx;
            const width = this.bufferCanvas.width;
            const height = this.bufferCanvas.height;
            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.strokeStyle = "#ccc";
            ctx.lineWidth = 1 * this.scale;
            ctx.stroke();
            ctx.strokeStyle = "#777";
            ctx.lineWidth = 0.5 * this.scale;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, (height / 20) * 10, 0, 2 * Math.PI);
            ctx.stroke(); 
            for (let i = -10; i <= 10; i++) {
                const x = (i + 10) * (width / 20);
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
                const y = (10 - i) * (height / 20);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }
        },
        coordToPixel(x, y) {
            const width = this.$refs.canvas.width;
            const height = this.$refs.canvas.height;
            return {
                px: (x + 10) * (width / 20),
                py: (10 - y) * (height / 20),
            };
        },
        reset(points) {
            this.points = points.map((p, index) => ({
                id: index,
                x: p[0],
                y: p[1],
            }));
            this.intentions = [];
            this.drawCoordinateSystem();
            this.drawMainCanvas();
        },
        move(id, x, y) {
            const point = this.points.find((p) => p.id === id);
            if (point) {
                this.intentions = this.intentions.filter(
                    (intent) => intent.from !== id
                );
                const { px: oldPx, py: oldPy } = this.coordToPixel(point.x, point.y);
                const { px: newPx, py: newPy } = this.coordToPixel(x, y);
                this.bufferCtx.imageSmoothingEnabled = true;
                this.bufferCtx.imageSmoothingQuality = 'high'; 
                this.bufferCtx.beginPath();
                this.bufferCtx.moveTo(oldPx, oldPy);
                this.bufferCtx.lineTo(newPx, newPy);
                this.bufferCtx.strokeStyle = colors[id][1]
                this.bufferCtx.lineWidth = 1 * this.scale;
                this.bufferCtx.stroke();
                point.x = x;
                point.y = y;
                this.drawMainCanvas();
            }
        },
        intention(id, x, z) {
            const point = this.points.find((p) => p.id === id);
            if (point) {
                this.intentions = this.intentions.filter(
                    (intent) => intent.from !== id
                );
                this.intentions.push({ from: id, x, y: z });
                this.drawMainCanvas();
            }
        },

        drawMainCanvas() {
            const ctx = this.$refs.canvas.getContext('2d');
            const width = this.$refs.canvas.width;
            const height = this.$refs.canvas.height;
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(this.bufferCanvas, 0, 0);
            this.points.forEach((point) => {
                this.drawDynamicPoint(ctx, point.id, point.x, point.y);
            });
            this.intentions.forEach((intent) => {
                this.drawIntention(ctx, intent);
            });
        },

        drawDynamicPoint(ctx, id, x, y) {
            const { px, py } = this.coordToPixel(x, y);
            ctx.beginPath();
            ctx.arc(px, py, 5 * this.scale, 0, Math.PI * 2);
            ctx.fillStyle = colors[id][0]
            ctx.fill();
        },

        drawIntention(ctx, intent) {
            const fromPoint = this.points.find((p) => p.id === intent.from);
            if (fromPoint) {
                const { px: fromPx, py: fromPy } = this.coordToPixel(fromPoint.x, fromPoint.y);
                const { px: toPx, py: toPy } = this.coordToPixel(intent.x, intent.y);
                ctx.beginPath();
                ctx.moveTo(fromPx, fromPy);
                ctx.lineTo(toPx, toPy);
                ctx.strokeStyle = "#0ff";
                ctx.lineWidth = 1 * this.scale;
                ctx.setLineDash([5 * this.scale, 3 * this.scale]);
                ctx.stroke();
                ctx.setLineDash([]);
                const angle = Math.atan2(toPy - fromPy, toPx - fromPx);
                const arrowLength = 10 * this.scale;
                const arrowAngle = Math.PI / 6;
                ctx.beginPath();
                ctx.moveTo(toPx, toPy);
                ctx.lineTo(
                    toPx - arrowLength * Math.cos(angle - arrowAngle),
                    toPy - arrowLength * Math.sin(angle - arrowAngle)
                );
                ctx.moveTo(toPx, toPy);
                ctx.lineTo(
                    toPx - arrowLength * Math.cos(angle + arrowAngle),
                    toPy - arrowLength * Math.sin(angle + arrowAngle)
                );
                ctx.strokeStyle = "#0ff";
                ctx.lineWidth = 1 * this.scale;
                ctx.stroke();
            }
        },
        handleCanvasClick(event) {
            const rect = this.$refs.canvas.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 20 - 10;
            const y = 10 - ((event.clientY - rect.top) / rect.height) * 20;
            this.$emit('move', { x, y });
        },
        updateHieght() {
            this.$refs.canvas.style.height = `${this.$refs.canvas.getBoundingClientRect().width}px`;
        }
    },
    mounted() {
        this.initBuffer();
        this.drawMainCanvas();
        this.updateHieght();
        this.handler = window.addEventListener('resize', this.updateHieght);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.handler);
    }
};
</script>

<style scoped>
canvas {
    border: 1px solid #ccc;
    max-width: 100%;
    height: auto;
}
</style>