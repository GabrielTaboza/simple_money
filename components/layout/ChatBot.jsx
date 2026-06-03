'use client'

import { useEffect, useRef, useState } from 'react'

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Olá! Sou o assistente financeiro do SimpleMoney. Como posso ajudar?',
    },
  ])

  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [messages])

  const handleSend = async (event) => {
    event.preventDefault()

    const question = input.trim()

    if (!question || loading) return

    setMessages((prev) => [
      ...prev,
      {
        from: 'user',
        text: question,
      },
    ])

    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
        }),
      })

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text:
            data.answer ||
            'Desculpe, não consegui gerar uma resposta.',
        },
      ])
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'Erro ao conectar com a IA.',
        },
      ])
    } finally {
      setLoading(false)
      setIsOpen(true)
    }
  }

  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end md:right-8">
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-2xl shadow-black/20 transition-transform duration-200 hover:scale-105 focus:outline-none"
          aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        >
          <span className="text-2xl md:text-3xl">💬</span>
        </button>
      </div>

      <div
        className={`mt-2 overflow-hidden rounded-[32px] border border-gray-200 bg-white/95 shadow-2xl shadow-black/10 backdrop-blur transition-all duration-300 ease-out ${
          isOpen ? 'h-[440px] w-80 opacity-100' : 'h-0 w-0 opacity-0'
        }`}
        aria-hidden={!isOpen}
      >
        {isOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-indigo-600 text-white">
              <div>
                <p className="text-sm font-semibold">
                  Assistente IA SimpleMoney
                </p>
                <p className="text-xs text-indigo-100">
                  Powered by Gemini
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Fechar chat"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 text-sm text-gray-800">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={`${message.from}-${index}`}
                    className={`flex ${
                      message.from === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm whitespace-pre-wrap ${
                        message.from === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-900">
                      Pensando...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form
              onSubmit={handleSend}
              className="border-t border-gray-200 px-3 py-3 bg-white"
            >
              <label htmlFor="chat-input" className="sr-only">
                Digite sua pergunta
              </label>

              <div className="flex items-center gap-2">
                <input
                  id="chat-input"
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Pergunte sobre finanças..."
                  className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center rounded-2xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? '...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}