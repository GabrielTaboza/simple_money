import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(req) {
  try {
    const { message } = await req.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    })

    const result = await model.generateContent(`
Você é o assistente financeiro do aplicativo SimpleMoney.

Ajude os usuários com:
- Educação financeira
- Controle de gastos
- Organização financeira
- Metas financeiras
- Reserva de emergência
- Planejamento financeiro

Pergunta:
${message}
`)

    return Response.json({
      answer: result.response.text(),
    })
  } catch (error) {
    console.error(error)

    return Response.json({
      answer: 'Desculpe, ocorreu um erro ao processar sua solicitação.'
    })
  }
}