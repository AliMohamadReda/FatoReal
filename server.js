const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const API_KEY = process.env.GOOGLE_API_KEY;

// Função para calcular score inicial
function calcularScore(texto) {

    texto = texto.toLowerCase();

    let score = 100;

    const palavrasSuspeitas = [
        "urgente",
        "compartilhe",
        "antes que apaguem",
        "milagre",
        "segredo",
        "governo não quer",
        "repasse",
        "fake",
        "escândalo"
    ];

    palavrasSuspeitas.forEach(palavra => {
        if (texto.includes(palavra)) {
            score -= 12;
        }
    });

    return Math.max(score, 0);
}

// Rota principal
app.post("/verificar", async (req, res) => {

    try {

        const { noticia } = req.body;

        if (!noticia) {
            return res.status(400).json({
                sucesso: false,
                erro: "Digite uma notícia"
            });
        }

        // Consulta API do Google
        const response = await axios.get(
            "https://factchecktools.googleapis.com/v1alpha1/claims:search",
            {
                params: {
                    query: noticia,
                    key: API_KEY
                }
            }
        );

        const claims = response.data.claims || [];

        let score = calcularScore(noticia);

        let avaliacao = "Sem verificação encontrada";

        if (claims.length > 0) {

            const rating =
                claims[0]?.claimReview?.[0]?.textualRating?.toLowerCase() || "";

            avaliacao = claims[0]?.claimReview?.[0]?.textualRating || avaliacao;

            if (rating.includes("false")) {
                score -= 55;
            }

            if (rating.includes("misleading")) {
                score -= 35;
            }

            if (rating.includes("true")) {
                score += 10;
            }
        }

        score = Math.max(0, Math.min(score, 100));

        let nivel = "";

        if (score >= 80) {
            nivel = "Confiável";
        }
        else if (score >= 50) {
            nivel = "Suspeita";
        }
        else {
            nivel = "Possível Fake News";
        }

        res.json({
            sucesso: true,
            score,
            nivel,
            avaliacao
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            sucesso: false,
            erro: "Erro ao analisar notícia"
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando em:");
    console.log("http://localhost:3000");
});