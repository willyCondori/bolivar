
/* ─────────────────────────────────────────────
   PARTICULAS OPTIMIZADO
──────────────────────────────────────────── */
function useParticles(ref) {
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let raf;

        const pts = Array.from({ length: 50 }, () => ({
            x: Math.random() * innerWidth,
            y: Math.random() * innerHeight,
            r: Math.random() * 1.5 + 0.4,
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2,
            o: Math.random() * 0.3 + 0.1,
        }));

        const resize = () => {
            canvas.width = innerWidth;
            canvas.height = innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (const p of pts) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(28,224,235,${p.o})`;
                ctx.fill();

                p.x += p.dx;
                p.y += p.dy;

                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }

            raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(raf);
            raf = null;
            window.removeEventListener('resize', resize);
        };
    }, []);
}
