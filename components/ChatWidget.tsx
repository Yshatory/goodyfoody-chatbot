"use client";

import { useState, useRef, useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";

type Step =
  | "home"
  | "bestelling"
  | "bestelling_actief"
  | "wijzigen"
  | "wijzigen_actief"
  | "maaltijdadvies"
  | "maaltijdadvies_result"
  | "bmi"
  | "calorieen"
  | "allergenen"
  | "anderevraag";

const box: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginTop: 12,
};

const button: CSSProperties = {
  background: "#fbeaea",
  color: "#111111",
  fontSize: 14,
  fontWeight: 700,
  padding: "8px 14px",
  borderRadius: 10,
  border: "1px solid #6f0000",
  cursor: "pointer",
  width: "fit-content",
  alignSelf: "center",
  textAlign: "center",
};

type Message = {
  role: "user" | "bot";
  text: ReactNode;
};

const N8N_WEBHOOK_URL = "https://n8n.kemetops.cloud/webhook/GoodyFoody";

export default function ChatWidget() {
  const [step, setStep] = useState<Step>("home");
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [showRestart, setShowRestart] = useState(false);
  const sessionIdRef = useRef(
    (typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`) as string
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey 👋 Welkom bij The Goody Foody! Waarmee kan ik je helpen?",
    },
  ]);

  const sendToN8n = (payload: {
    sessionId: string;
    intent: string;
    step: Step;
    text?: string;
  }) => {
    if (!N8N_WEBHOOK_URL || N8N_WEBHOOK_URL.includes("JOUW_N8N_WEBHOOK_URL")) return;
    fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  const typeBotMessage = (text: string, delay = 6) => {
    setMessages((p) => [...p, { role: "bot", text: "" }]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMessages((p) => {
        const last = p[p.length - 1];
        if (last.role !== "bot") return p;
        const updated = [...p];
        updated[updated.length - 1] = { ...last, text: text.slice(0, i) };
        return updated;
      });
      if (i >= text.length) clearInterval(interval);
    }, delay);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  return (
    <>
      {/* CLOSED WIDGET */}
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 10,
            zIndex: 9998,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              color: "#111",
              padding: "8px 12px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              whiteSpace: "nowrap",
            }}
          >
            Hulp nodig?
          </div>
          <div
            onClick={() => setIsOpen(true)}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#8B0000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src="/chef-avatar.png"
              alt="Chef"
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff" }}
            />
          </div>
        </div>
      )}

      {/* OPEN WIDGET */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 60,
            right: 24,
            width: 420,
            height: 680,
            maxHeight: "85vh",
            background: "#f7f7f7",
            borderRadius: 18,
            boxShadow: "0 20px 60px rgba(0,0,0,.35)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "Arial, sans-serif",
            zIndex: 9999,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              background: "#8B0000",
              color: "#fff",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* LINKS */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src="/circle-logo-tgf.png"
                alt="The Goody Foody"
                style={{ width: 36, height: 36, borderRadius: "50%" }}
              />
              <div>
                <div style={{ fontWeight: 600 }}>Klanten Service</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>The Goody Foody 24/7</div>
              </div>
            </div>
            {/* RECHTS */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setShowRestart(true)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "6px 8px",
                  lineHeight: 1,
                }}
              >
                ↺
              </button>
              <button
                onClick={() => setIsOpen(false)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  borderRadius: 8,
                  padding: "6px 8px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* BODY */}
          <div
            className="bs-body"
            style={{
              flex: 1,
              padding: 16,
              overflowY: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>
              {`
                .bs-body::-webkit-scrollbar { display: none; }
              `}
            </style>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {m.role === "bot" && (
                  <img
                    src="/chef-avatar.png"
                    alt="Chef"
                    style={{ width: 32, height: 32, borderRadius: "50%" }}
                  />
                )}
                <div
                  style={{
                    background: m.role === "user" ? "#8B0000" : "#ffffff",
                    color: m.role === "user" ? "#ffffff" : "#000000",
                    padding: "10px 14px",
                    borderRadius: m.role === "user" ? "18px 18px 0 18px" : "18px 18px 18px 0",
                    maxWidth: "75%",
                    fontSize: 14,
                    lineHeight: "1.4",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />

            {/* HOME */}
            {step === "home" && (
              <div style={box}>
                {[
                  {
                    label: "📦 Bestelling",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "📦 Bestelling" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_order", step: "home" });
                      typeBotMessage("Waarmee kan ik je helpen met je bestelling? 🙂");
                      setStep("bestelling");
                    },
                  },
                  {
                    label: "⚠️ Allergeneninformatie",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "⚠️ Allergeneninformatie" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_allergens", step: "home" });
                      typeBotMessage(
                        "Bij The Goody Foody staan kwaliteit en jouw gezondheid centraal! 💪\n\n" +
                          "✅ Onze maaltijden bevatten hoge porties eiwitten.\n" +
                          "👨‍🍳 Bereid door meesterchefkoks.\n" +
                          "🟢 100% halal.\n\n" +
                          "Over welk gerecht wil je info?",
                        20
                      );
                      setStep("allergenen");
                    },
                  },
                  {
                    label: "🥗 Maaltijdadvies",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "🥗 Maaltijdadvies" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_meal_advice", step: "home" });
                      typeBotMessage("Wat is je doel? 🙂");
                      setStep("maaltijdadvies");
                    },
                  },
                  {
                    label: "📊 BMI berekenen",
                    onClick: () => {
                      setMessages((p) => [
                        ...p,
                        { role: "user", text: "📊 BMI berekenen" },
                        {
                          role: "bot",
                          text: (
                            <>
                              ⚖️ Je BMI berekenen?<br />
                              👉{" "}
                              
                                href="https://www.thegoodyfoody.com/nl-be/pages/bmi"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}
                              >
                                Ga naar de BMI-calculator
                              </a>
                            </>
                          ),
                        },
                      ]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_bmi", step: "home" });
                      setStep("bmi");
                    },
                  },
                  {
                    label: "🔥 Calorieën berekenen",
                    onClick: () => {
                      setMessages((p) => [
                        ...p,
                        { role: "user", text: "🔥 Calorieën berekenen" },
                        {
                          role: "bot",
                          text: (
                            <>
                              🔥 Caloriebehoefte berekenen?<br />
                              👉{" "}
                              
                                href="https://www.thegoodyfoody.com/nl-be/pages/calorie-calculator"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#1a73e8", fontWeight: 600, textDecoration: "underline" }}
                              >
                                Caloriecalculator openen
                              </a>
                            </>
                          ),
                        },
                      ]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_calories", step: "home" });
                      setStep("calorieen");
                    },
                  },
                  {
                    label: "💬 Andere vraag",
                    onClick: () => {
                      setMessages((p) => [...p, { role: "user", text: "💬 Andere vraag" }]);
                      sendToN8n({ sessionId: sessionIdRef.current, intent: "menu_other", step: "home" });
                      typeBotMessage("Waarmee kan ik je helpen 🙂");
                      setStep("anderevraag");
                    },
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    style={button}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#8B0000";
                      e.currentTarget.style.border = "1.5px solid #8B0000";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fdecec";
                      e.currentTarget.style.border = "1.5px solid #7a0000";
                      e.currentTarget.style.color = "#111111";
                    }}
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* REST OF THE STEPS - I'll continue in next message due to length */}
          </div>
        </div>
      )}
    </>
  );
}
