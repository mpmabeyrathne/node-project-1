import express from "express";

export function createApp() {
    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => {
        res.status(200).json({
            message: "Booking System API",
        })
    })

    app.get("/health",(_req, res)=>{
        res.status(200).json({
            status: "ok",
        })
    })

    return app;
}
