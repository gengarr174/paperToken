import Captcha from "../models/CaptchaModel.js";

// Adiciona +1 token ao usuário autenticado via captcha
export const addToken = async (req, res, next) => {
    try {
        // Verifica se o usuário está autenticado
        if (!req.session?.user) return res.status(401).json({ error: "Não autenticado" });
        // Impede admins de ganharem tokens
        if (req.session.user.role === "admin") return res.status(403).json({ error: "Admins não podem adicionar tokens" });
        // Adiciona token no banco
        const result = await Captcha.addToken(req.session.user.id);
        // Atualiza os tokens na sessão
        req.session.user.tokens = result;
        // Salva a sessão antes de responder
        return req.session.save(() => {
            res.status(200).json({
                success: true,
                tokens: result
            });
        });
    } catch (e) {
         // Trata erros conhecidos de regra de negócio
        if (e.message === "Usuário não encontrado") return res.status(404).json({ error: e.message });
        if (e.message === "Limite de tokens atingido") return res.status(400).json({ error: e.message });
        if (e.message === "Usuário banido") return res.status(403).json({ error: e.message });
        next(e);
    }
};