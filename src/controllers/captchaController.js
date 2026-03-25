import Captcha from "../models/CaptchaModel.js";

export const addToken = async (req, res) => {
    try {
        if (!req.session?.user) return res.status(401).json({ error: "Não autenticado" });
        if (req.session.user.role === "admin") return res.status(403).json({ error: "Admins não podem adicionar tokens" });
        
        const result = await Captcha.addToken(req.session.user.id);
        req.session.user.tokens = result;

        return req.session.save(() => {
            res.status(200).json({
                success: true,
                tokens: result
            });
        });
    } catch (e) {
        if (e.message === "Usuário não encontrado") return res.status(404).json({ error: e.message });
        if (e.message === "Limite de tokens atingido") return res.status(400).json({ error: e.message });
        if (e.message === "Usuário banido") return res.status(403).json({ error: e.message });
        console.error(e);
        return res.status(500).json({ error: "Erro ao adicionar token" });
    }
};